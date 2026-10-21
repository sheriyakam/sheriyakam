package com.sheriyakam.android.ui

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sheriyakam.domain.TriageEngine
import com.sheriyakam.domain.TriageResult
import com.sheriyakam.domain.UrgencyTier

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SmartTriageScreen(
    onConfirmBooking: (TriageResult) -> Unit = {}
) {
    var problemText by remember { mutableStateOf("Main MCB trip and there is spark in the kitchen switchboard") }

    val triageResult: TriageResult = remember(problemText) {
        TriageEngine.triageProblem(problemText)
    }

    val isEmergency = triageResult.urgency == UrgencyTier.EMERGENCY

    val badgeColor by animateColorAsState(
        targetValue = if (isEmergency) Color(0xFFEF4444) else Color(0xFF38BDF8),
        label = "BadgeColorAnimation"
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "AI Problem Diagnostic",
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF0A0F1C)
                )
            )
        },
        containerColor = Color(0xFF0A0F1C)
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Problem Input Box
            Text(
                "Describe the electrical issue:",
                color = Color(0xFF94A3B8),
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium
            )

            OutlinedTextField(
                value = problemText,
                onValueChange = { problemText = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(110.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = Color(0xFF131B2E),
                    unfocusedContainerColor = Color(0xFF131B2E),
                    focusedBorderColor = Color(0xFFF59E0B),
                    unfocusedBorderColor = Color(0xFF1E293B),
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                shape = RoundedCornerShape(12.dp)
            )

            // Diagnostic Classification Card
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF131B2E)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(
                        width = 1.dp,
                        color = if (isEmergency) Color(0xFFEF4444) else Color(0xFF1E293B),
                        shape = RoundedCornerShape(12.dp)
                    )
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            triageResult.matchedServiceName,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )

                        // Urgency Pill
                        Surface(
                            color = badgeColor.copy(alpha = 0.15f),
                            shape = RoundedCornerShape(20.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, badgeColor)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Icon(
                                    imageVector = if (isEmergency) Icons.Default.Warning else Icons.Default.CheckCircle,
                                    contentDescription = null,
                                    tint = badgeColor,
                                    modifier = Modifier.size(13.dp)
                                )
                                Text(
                                    text = if (isEmergency) "90-MIN EMERGENCY" else "STANDARD DISPATCH",
                                    color = badgeColor,
                                    fontWeight = FontWeight.ExtraBold,
                                    fontSize = 10.sp
                                )
                            }
                        }
                    }

                    Text(
                        triageResult.diagnosisNote,
                        color = Color(0xFFCBD5E1),
                        fontSize = 14.sp
                    )

                    Divider(color = Color(0xFF1E293B), thickness = 1.dp)

                    // Clarifying Question
                    Text(
                        "Wireman Question: \"${triageResult.clarifyingQuestion}\"",
                        color = Color(0xFFFDE68A),
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Estimated Diagnostic & Repair:", color = Color(0xFF94A3B8), fontSize = 13.sp)
                        Text(triageResult.estimatedPrice, color = Color(0xFFF59E0B), fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // CTA Button
            Button(
                onClick = { onConfirmBooking(triageResult) },
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isEmergency) Color(0xFFEF4444) else Color(0xFFF59E0B)
                ),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp)
            ) {
                Text(
                    text = if (isEmergency) "Dispatch Emergency Electrician Now" else "Proceed with Booking (${triageResult.estimatedPrice})",
                    color = if (isEmergency) Color.White else Color.Black,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
            }
        }
    }
}
