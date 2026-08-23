import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate {
    var webView: WKWebView!
    var touchOverlay: TouchOverlayView!

    let urlStorageKey = "airsketch_saved_server_url"

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 24/255, green: 24/255, blue: 27/255, alpha: 1)

        // 1. Configure the Web View
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        
        webView = WKWebView(frame: view.bounds, configuration: config)
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        webView.navigationDelegate = self
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        view.addSubview(webView)

        // 2. Configure Native Touch Overlay (240Hz Digitizer)
        touchOverlay = TouchOverlayView(frame: view.bounds)
        touchOverlay.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        touchOverlay.isMultipleTouchEnabled = true
        touchOverlay.backgroundColor = .clear
        touchOverlay.onTouches = { [weak self] phase, touchData in
            self?.sendTouchesToWeb(phase: phase, touchData: touchData)
        }
        view.addSubview(touchOverlay)

        // 3. Gesture to change Server URL / Token anytime: Tap screen with 3 fingers
        let changeURLGesture = UITapGestureRecognizer(target: self, action: #selector(promptForServerURL))
        changeURLGesture.numberOfTouchesRequired = 3
        view.addGestureRecognizer(changeURLGesture)

        // 4. Load Saved URL or Show Setup Prompt
        if let saved = UserDefaults.standard.string(forKey: urlStorageKey), !saved.isEmpty {
            connectToServer(urlString: saved)
        } else {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
                self?.promptForServerURL()
            }
        }
    }

    func connectToServer(urlString: String) {
        var clean = urlString.trimmingCharacters(in: .whitespacesAndNewlines)
        if !clean.lowercased().hasPrefix("http://") && !clean.lowercased().hasPrefix("https://") {
            clean = "http://" + clean
        }

        guard let url = URL(string: clean) else {
            promptForServerURL(errorMessage: "Invalid URL format. Please try again.")
            return
        }

        // Save URL for future app launches
        UserDefaults.standard.set(clean, forKey: urlStorageKey)
        webView.load(URLRequest(url: url))
    }

    @objc func promptForServerURL(errorMessage: String? = nil) {
        let alert = UIAlertController(
            title: "Connect to AirSketch",
            message: errorMessage ?? "Paste your AirSketch pairing URL (including token) below.\n\n💡 Tip: Tap with 3 fingers anytime to open this menu again.",
            preferredStyle: .alert
        )

        alert.addTextField { textField in
            textField.placeholder = "http://MacBook.local:4444?token=..."
            textField.text = UserDefaults.standard.string(forKey: self.urlStorageKey)
            textField.clearButtonMode = .whileEditing
            textField.autocorrectionType = .no
            textField.autocapitalizationType = .none
        }

        // Quick button if URL is in clipboard
        if let clip = UIPasteboard.general.string, clip.contains("4444") || clip.contains("http") {
            alert.addAction(UIAlertAction(title: "📋 Paste from Clipboard", style: .default) { [weak self] _ in
                self?.connectToServer(urlString: clip)
            })
        }

        alert.addAction(UIAlertAction(title: "Connect", style: .default) { [weak self, weak alert] _ in
            if let text = alert?.textFields?.first?.text, !text.isEmpty {
                self?.connectToServer(urlString: text)
            }
        })

        if UserDefaults.standard.string(forKey: urlStorageKey) != nil {
            alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
        }

        present(alert, animated: true)
    }

    func sendTouchesToWeb(phase: String, touchData: [[String: Any]]) {
        guard let jsonData = try? JSONSerialization.data(withJSONObject: touchData),
              let jsonString = String(data: jsonData, encoding: .utf8) else { return }
        
        let js = "window.onNativeTouch && window.onNativeTouch('\(phase)', \(jsonString));"
        webView.evaluateJavaScript(js, completionHandler: nil)
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        promptForServerURL(errorMessage: "Could not connect to server.\nPlease check your Wi-Fi and URL.")
    }

    override var prefersStatusBarHidden: Bool {
        return true
    }
}

// ----------------------------------------------------
// Native Touch Overlay: 240Hz Hardware Interception
// ----------------------------------------------------
class TouchOverlayView: UIView {
    var onTouches: ((String, [[String: Any]]) -> Void)?

    override init(frame: CGRect) {
        super.init(frame: frame)
        isMultipleTouchEnabled = true
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        isMultipleTouchEnabled = true
    }

    // Pass touches in top 60px down to WKWebView so UI buttons work
    override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
        if point.y <= 60 {
            return nil
        }
        return self
    }

    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        forward(phase: "start", touches: event?.allTouches ?? touches)
    }

    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
        forward(phase: "move", touches: event?.allTouches ?? touches)
    }

    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        forward(phase: "end", touches: event?.allTouches ?? touches)
    }

    override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent?) {
        forward(phase: "cancel", touches: event?.allTouches ?? touches)
    }

    private func forward(phase: String, touches: Set<UITouch>) {
        var list: [[String: Any]] = []
        for t in touches {
            let loc = t.preciseLocation(in: self)
            let isStylus = t.type == .pencil || t.type == .stylus
            let item: [String: Any] = [
                "id": ObjectIdentifier(t).hashValue,
                "type": isStylus ? "stylus" : "direct",
                "x": Double(loc.x),
                "y": Double(loc.y),
                "force": Double(t.force),
                "phase": phaseString(t.phase)
            ]
            list.append(item)
        }
        onTouches?(phase, list)
    }

    private func phaseString(_ phase: UITouch.Phase) -> String {
        switch phase {
        case .began: return "began"
        case .moved: return "moved"
        case .stationary: return "stationary"
        case .ended: return "ended"
        case .cancelled: return "cancelled"
        default: return "unknown"
        }
    }
}
