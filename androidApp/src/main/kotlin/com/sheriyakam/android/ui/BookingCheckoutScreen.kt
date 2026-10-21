package com.sheriyakam.android.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sheriyakam.domain.PaymentSplit
import com.sheriyakam.domain.SplitBreakdown

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BookingCheckoutScreen(
    laborCharge: Double = 400.0,
    materialsCharge: Double = 300.0,
    travelAllowance: Double = 50.0,
    platformFee: Double = 29.0
) {
    // Computed reactively via KMP Shared Domain Logic
    val breakdown: SplitBreakdown = remember(laborCharge, materialsCharge, travelAllowance, platformFee) {
        PaymentSplit.calculateSplitBreakdown(
            laborCharge = laborCharge,
            platformFee = platformFee,
            materialsCharge = materialsCharge,
            travelAllowance = travelAllowance
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "Booking Checkout",
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
            // Service Summary Card
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF131B2E)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        "Kerala Electrical Service (SAC 9987)",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        "KSELB Certified Wireman On-Site Dispatch",
                        fontSize = 14.sp,
                        color = Color(0xFF94A3B8)
                    )
                }
            }

            // Price Breakdown Card
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF131B2E)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    PriceRow("Labor Charge", "₹${breakdown.laborCharge.toInt()}")
                    PriceRow("Platform & Diagnostic Fee", "₹${breakdown.platformFee.toInt()}")
                    PriceRow("ISI Approved Materials", "₹${breakdown.materialsCharge.toInt()}")
                    PriceRow("Travel Allowance", "₹${breakdown.travelAllowance.toInt()}")
                    PriceRow("GST (18% SAC 9987)", "₹${breakdown.totalTax}")

                    Divider(color = Color(0xFF1E293B), thickness = 1.dp)

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            "Grand Total",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            "₹${breakdown.grandTotal}",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Color(0xFFF59E0B)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Confirm & Pay CTA
            Button(
                onClick = { /* Launch Razorpay Route Escrow */ },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF59E0B)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp)
            ) {
                Text(
                    "Confirm & Pay ₹${breakdown.grandTotal}",
                    color = Color.Black,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
            }
        }
    }
}

@Composable
private fun PriceRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, color = Color(0xFF94A3B8), fontSize = 14.sp)
        Text(value, color = Color.White, fontWeight = FontWeight.Medium, fontSize = 14.sp)
    }
}
