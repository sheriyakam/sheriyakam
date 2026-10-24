package com.sheriyakam.android.notifications

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.sheriyakam.android.MainActivity
import com.sheriyakam.notifications.PushNotificationManager

class SheriyakamFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // Token registration will be dispatched to Sheriyakam backend API
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        val rawMap = remoteMessage.data.toMutableMap()
        if (!rawMap.containsKey("title") && remoteMessage.notification != null) {
            rawMap["title"] = remoteMessage.notification?.title ?: ""
            rawMap["body"] = remoteMessage.notification?.body ?: ""
        }

        val parsed = PushNotificationManager.parsePayload(rawMap) ?: return
        showNotification(parsed.title, parsed.body, PushNotificationManager.generateDeepLinkUri(parsed))
    }

    private fun showNotification(title: String, body: String, deepLinkUri: String) {
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "sheriyakam_dispatch_channel"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Sheriyakam Service Dispatches",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Critical alerts for electrician dispatch, arrival, and emergency SLAs"
                enableVibration(true)
            }
            notificationManager.createNotificationChannel(channel)
        }

        val intent = Intent(this, MainActivity::class.java).apply {
            action = Intent.ACTION_VIEW
            data = Uri.parse(deepLinkUri)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)

        notificationManager.notify(System.currentTimeMillis().toInt(), builder.build())
    }
}
