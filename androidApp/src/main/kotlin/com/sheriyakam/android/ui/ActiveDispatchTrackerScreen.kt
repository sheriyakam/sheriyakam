package com.sheriyakam.android.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sheriyakam.repository.Booking
import com.sheriyakam.repository.BookingStatus

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ActiveDispatchTrackerScreen(
    booking: Booking,
    remainingMinutes: Long,
    slaStatus: String,
    onVerifyCheckInOtp: (String) -> Unit,
    onVerifyCompletionOtp: (String) -> Unit,
    onRaiseDispute: (String) -> Unit,
    onBackClick: () -> Unit
) {
    var checkInInput by remember { mutableStateOf("") }
    var completionInput by remember { mutableStateOf("") }
    var disputeInput by remember { mutableStateOf("") }
    var showDisputeDialog by remember { mutableStateOf(false) }

    val statusColor = when (booking.status) {
        BookingStatus.OPEN -> Color(0xFF38BDF8)
        BookingStatus.ACCEPTED -> Color(0xFFF59E0B)
        BookingStatus.IN_PROGRESS -> Color(0xFF10B981)
        BookingStatus.COMPLETED -> Color(0xFF10B981)
        BookingStatus.DISPUTED -> Color(0xFFEF4444)
        BookingStatus.CANCELLED -> Color(0xFF64748B)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Live Dispatch #${booking.id}",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            text = "${booking.district} • ${booking.taluk}",
                            fontSize = 12.sp,
                            color = Color(0xFF94A3B8)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF0F172A)
                )
            )
        },
        containerColor = Color(0xFF0B1120)
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // SLA Countdown Card
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "90-Min Emergency SLA",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Surface(
                            color = statusColor.copy(alpha = 0.2f),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = booking.status.name,
                                color = statusColor,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = if (remainingMinutes > 0) "$remainingMinutes mins remaining" else "SLA Expired",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = if (remainingMinutes <= 15) Color(0xFFEF4444) else Color(0xFF10B981)
                    )

                    LinearProgressIndicator(
                        progress = { (remainingMinutes.coerceIn(0, 90).toFloat() / 90f) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 8.dp)
                            .height(6.dp),
                        color = if (remainingMinutes <= 15) Color(0xFFEF4444) else Color(0xFF10B981),
                        trackColor = Color(0xFF334155)
                    )
                }
            }

            // Assigned Electrician Card
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Assigned Wireman (KSELB Certified)",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF94A3B8)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = booking.partnerName ?: "Locating nearest technician...",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    if (booking.assignedPartnerPhone != null) {
                        Text(
                            text = booking.assignedPartnerPhone,
                            fontSize = 14.sp,
                            color = Color(0xFF38BDF8)
                        )
                    }
                }
            }

            // OTP Verification Card
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Two-Step Physical Verification OTPs",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "Share with wireman only after physical arrival and job completion",
                        fontSize = 11.sp,
                        color = Color(0xFF94A3B8)
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    // Step 1: Check-in OTP
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("1. Arrival Check-In OTP", fontSize = 12.sp, color = Color(0xFFCBD5E1))
                            Text(booking.checkInOtp, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color(0xFFF59E0B))
                        }
                        if (booking.status == BookingStatus.ACCEPTED) {
                            OutlinedTextField(
                                value = checkInInput,
                                onValueChange = { checkInInput = it },
                                placeholder = { Text("Enter OTP", fontSize = 11.sp) },
                                modifier = Modifier.width(110.dp),
                                singleLine = true
                            )
                            Button(
                                onClick = { onVerifyCheckInOtp(checkInInput) },
                                shape = RoundedCornerShape(6.dp),
                                contentPadding = PaddingValues(horizontal = 8.dp)
                            ) {
                                Text("Check In", fontSize = 11.sp)
                            }
                        }
                    }

                    Divider(color = Color(0xFF334155), modifier = Modifier.padding(vertical = 12.dp))

                    // Step 2: Completion OTP
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("2. Job Completion OTP", fontSize = 12.sp, color = Color(0xFFCBD5E1))
                            Text(booking.completionOtp, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color(0xFF10B981))
                        }
                        if (booking.status == BookingStatus.IN_PROGRESS) {
                            OutlinedTextField(
                                value = completionInput,
                                onValueChange = { completionInput = it },
                                placeholder = { Text("Enter OTP", fontSize = 11.sp) },
                                modifier = Modifier.width(110.dp),
                                singleLine = true
                            )
                            Button(
                                onClick = { onVerifyCompletionOtp(completionInput) },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)),
                                shape = RoundedCornerShape(6.dp),
                                contentPadding = PaddingValues(horizontal = 8.dp)
                            ) {
                                Text("Complete", fontSize = 11.sp)
                            }
                        }
                    }
                }
            }

            // Dispute Action
            OutlinedButton(
                onClick = { showDisputeDialog = true },
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFFEF4444)),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Report Issue / Lock Escrow", fontWeight = FontWeight.Bold)
            }
        }
    }

    if (showDisputeDialog) {
        AlertDialog(
            onDismissRequest = { showDisputeDialog = false },
            title = { Text("Lock Escrow & Dispute Booking") },
            text = {
                OutlinedTextField(
                    value = disputeInput,
                    onValueChange = { disputeInput = it },
                    label = { Text("Reason for Dispute") },
                    modifier = Modifier.fillMaxWidth()
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        onRaiseDispute(disputeInput)
                        showDisputeDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444))
                ) {
                    Text("Lock Escrow")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDisputeDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}
