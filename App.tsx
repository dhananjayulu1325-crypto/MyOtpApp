// App.tsx
import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [screen, setScreen] = useState<"phone" | "verify">("phone");
  const [phone, setPhone] = useState<string>("");
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);

  const refs = useRef<(TextInput | null)[]>([]);

  function goToVerify() {
    const onlyDigits = phone.replace(/\D/g, "");
    if (onlyDigits.length < 10) {
      Alert.alert("Invalid", "Enter a valid phone number (min 10 digits).");
      return;
    }
    setScreen("verify");
  }

  function setDigit(i: number, v: string) {
    if (!/^\d*$/.test(v)) return;
    const next = [...digits];
    next[i] = v.slice(-1);
    setDigits(next);

    if (v && i < refs.current.length - 1) {
      refs.current[i + 1]?.focus?.();
    }
  }

  function onKeyPress(
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    i: number
  ) {
    if (e.nativeEvent.key === "Backspace" && digits[i] === "" && i > 0) {
      refs.current[i - 1]?.focus?.();
    }
  }

  function verifyOtp() {
    const otp = digits.join("");
    if (otp.length < 6) {
      Alert.alert("Invalid OTP", "Enter all 6 digits");
      return;
    }
    Alert.alert("OTP Verified (demo)", `Phone: ${phone}\nOTP: ${otp}`);
    setDigits(["", "", "", "", "", ""]);
    setScreen("phone");
    setPhone("");
  }

  function resendOtp() {
    Alert.alert("Resent (demo)", `OTP resent to ${phone}`);
    setDigits(["", "", "", "", "", ""]);
    refs.current[0]?.focus?.();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          {screen === "phone" ? (
            <>
               <Ionicons name="call-outline" size={42} color={PURPLE} />
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>
                  Sign in with your mobile number
                </Text>

              <Text style={styles.label}>Mobile Number</Text>

              {/* PHONE INPUT WITH CALL ICON */}
              <View style={styles.phoneRow}>
              <View style={styles.countryBox}>
                <Text style={styles.countryCode}>+91</Text>
              </View>

              <TextInput
                style={styles.phoneInput}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
              <TouchableOpacity style={styles.btn} onPress={goToVerify}>
                <Text style={styles.btnText}>Send OTP</Text>
              </TouchableOpacity>
              <Text style={[styles.subtitle, { marginVertical: 10 }]}>
                ——— or ———
              </Text>

              {/* SIGN UP LINK */}
              <TouchableOpacity
                onPress={() => Alert.alert("Sign Up", "Navigate to Sign Up screen")}
                style={{ marginTop: 14 }}
              >
                <Text style={{ color: "#777", fontWeight: "600" }}>
                   Don't have an account?{" "}
                  <Text style={{ color: "#1E90FF", fontWeight: "700" }}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
              
            </>
          ) : (
            <>
              {/* SHIELD ICON */}
              <Ionicons
                name="shield-checkmark-outline"
                size={44}
                color={PURPLE}
                style={{ marginBottom: 8 }}
              />

              <Text style={styles.title}>Verify OTP</Text>
              <Text style={styles.subtitle}>Enter the OTP sent to</Text>
              <Text style={styles.phoneText}>{phone}</Text>

              <View style={styles.otpRow}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TextInput
                    key={i}
                    ref={(r) => {refs.current[i] = r;}}
                    value={digits[i]}
                    onChangeText={(v) => setDigit(i, v)}
                    onKeyPress={(e) => onKeyPress(e, i)}
                    keyboardType="number-pad"
                    style={styles.otpCell}
                    textAlign="center"
                    maxLength={1}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[styles.btn, { marginTop: 18 }]}
                onPress={verifyOtp}
              >
                <Text style={styles.btnText}>Verify OTP</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: "row", marginTop: 12 }}>
                <TouchableOpacity onPress={resendOtp}>
                  <Text style={styles.link}>Resend OTP</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setScreen("phone")}
                  style={{ marginLeft: 20 }}
                >
                  <Text style={styles.linkGray}>Change number</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const PURPLE = "#5b2df7";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#d0d6f1ff" },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 22,
    alignItems: "center",
    elevation: 4,
  },
  title: { fontSize: 20, fontWeight: "600", color: "#222" },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
    textAlign: "center",
  },
  phoneText: { color: "#333", marginTop: 6, fontWeight: "600" },
  label: {
    alignSelf: "flex-start",
    marginTop: 16,
    color: "#555",
    fontSize: 16,
  },

  /* INPUT WITH ICON */
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
  },
  phoneInput: {
    flex: 1,
    padding: 12,
    marginLeft: 6,
  },

  btn: {
    width: "100%",
    backgroundColor: PURPLE,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },

  otpRow: {
    marginTop: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  otpCell: {
    width: 48,
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    fontSize: 20,
  },
  link: { color: PURPLE, fontWeight: "600" },
  linkGray: { color: "#7a7a7cff", fontWeight: "600" },
  phoneRow: {
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  marginBottom: 20,
  overflow: "hidden",
},

countryBox: {
  paddingHorizontal: 14,
  paddingVertical: 12,
  backgroundColor: "#f3f4f6",
  borderRightWidth: 1,
  borderColor: "#ddd",
},

countryCode: {
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
},

});