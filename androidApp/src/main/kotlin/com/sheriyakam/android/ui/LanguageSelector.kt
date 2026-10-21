package com.sheriyakam.android.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sheriyakam.domain.LanguageCode
import com.sheriyakam.domain.LocalizationEngine

@Composable
fun LanguageSelector(
    selectedLanguage: LanguageCode,
    onLanguageChange: (LanguageCode) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .background(Color(0xFF131B2E), shape = RoundedCornerShape(20.dp))
            .border(1.dp, Color(0xFF1E293B), shape = RoundedCornerShape(20.dp))
            .padding(3.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        LanguagePill(
            label = "EN",
            isSelected = selectedLanguage == LanguageCode.EN,
            onClick = { onLanguageChange(LanguageCode.EN) }
        )
        LanguagePill(
            label = "മലയാളം",
            isSelected = selectedLanguage == LanguageCode.ML,
            onClick = { onLanguageChange(LanguageCode.ML) }
        )
    }
}

@Composable
private fun LanguagePill(
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .background(
                color = if (isSelected) Color(0xFFF59E0B) else Color.Transparent,
                shape = RoundedCornerShape(16.dp)
            )
            .clickable(onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 6.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            color = if (isSelected) Color.Black else Color(0xFF94A3B8),
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
            fontSize = 12.sp
        )
    }
}
