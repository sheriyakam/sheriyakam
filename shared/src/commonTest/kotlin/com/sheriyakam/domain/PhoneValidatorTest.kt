package com.sheriyakam.domain

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class PhoneValidatorTest {

    @Test
    fun testValidates10DigitIndianNumberWithPlus91Normalization() {
        val res1 = PhoneValidator.validate("9876543210")
        assertTrue(res1.isValid)
        assertEquals("+919876543210", res1.normalized)

        val res2 = PhoneValidator.validate("+91 94471 28901")
        assertTrue(res2.isValid)
        assertEquals("+919447128901", res2.normalized)

        val res3 = PhoneValidator.validate("09447128901")
        assertTrue(res3.isValid)
        assertEquals("+919447128901", res3.normalized)
    }

    @Test
    fun testRejectsInvalidLeadingDigitsAndLengths() {
        val invalidLeading = PhoneValidator.validate("4876543210")
        assertFalse(invalidLeading.isValid)
        assertEquals("Mobile number must start with 6, 7, 8, or 9", invalidLeading.error)

        val invalidLength = PhoneValidator.validate("12345")
        assertFalse(invalidLength.isValid)
        assertEquals("Please enter a valid 10-digit mobile number", invalidLength.error)

        val empty = PhoneValidator.validate("")
        assertFalse(empty.isValid)
        assertEquals("Phone number is required", empty.error)
    }
}
