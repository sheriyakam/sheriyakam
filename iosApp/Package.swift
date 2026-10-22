// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "SheriyakamIOS",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(
            name: "SheriyakamIOS",
            targets: ["SheriyakamIOS"]
        )
    ],
    dependencies: [],
    targets: [
        .target(
            name: "SheriyakamIOS",
            path: "Views"
        )
    ]
)
