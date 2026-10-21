import SwiftUI

enum AppLanguage: String, CaseIterable {
    case en = "EN"
    case ml = "മലയാളം"
}

struct LanguageSelectorView: View {
    @Binding var selectedLanguage: AppLanguage

    var body: some View {
        HStack(spacing: 4) {
            ForEach(AppLanguage.allCases, id: \.self) { lang in
                Text(lang.rawValue)
                    .font(.caption)
                    .fontWeight(selectedLanguage == lang ? .bold : .medium)
                    .foregroundColor(selectedLanguage == lang ? .black : Color(red: 148/255, green: 163/255, blue: 184/255))
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(selectedLanguage == lang ? Color(red: 245/255, green: 158/255, blue: 11/255) : Color.clear)
                    .cornerRadius(14)
                    .onTapGesture {
                        selectedLanguage = lang
                    }
            }
        }
        .padding(3)
        .background(Color(red: 19/255, green: 27/255, blue: 46/255))
        .cornerRadius(18)
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(Color(red: 30/255, green: 41/255, blue: 59/255), lineWidth: 1)
        )
    }
}
