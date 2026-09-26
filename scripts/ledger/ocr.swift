// OCR for the image-only exam papers (fetch_jp_exams.py), with the macOS Vision framework.
//
//     swift scripts/ledger/ocr.swift page-01.png page-02.png ... > paper.txt
//
// Prints the recognized lines of each image in order, the images separated by a form feed
// (as pdftotext separates pages). Japanese first, then English. Runs locally: nothing is sent anywhere.
import AppKit
import Foundation
import Vision

for (n, path) in CommandLine.arguments.dropFirst().enumerated() {
    if n > 0 { print("\u{0C}", terminator: "") }
    guard let image = NSImage(contentsOfFile: path),
          let cg = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        FileHandle.standardError.write("cannot read \(path)\n".data(using: .utf8)!)
        continue
    }
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.recognitionLanguages = ["ja-JP", "en-US"]
    request.usesLanguageCorrection = true
    do {
        try VNImageRequestHandler(cgImage: cg, options: [:]).perform([request])
    } catch {
        FileHandle.standardError.write("\(path): \(error)\n".data(using: .utf8)!)
        continue
    }
    // top to bottom, then left to right (Vision's y axis points up)
    let lines = (request.results ?? []).compactMap { obs -> (CGRect, String)? in
        guard let text = obs.topCandidates(1).first?.string else { return nil }
        return (obs.boundingBox, text)
    }.sorted { a, b in
        abs(a.0.midY - b.0.midY) > 0.01 ? a.0.midY > b.0.midY : a.0.minX < b.0.minX
    }
    for (_, text) in lines { print(text) }
}
