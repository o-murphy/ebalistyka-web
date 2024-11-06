import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Chip, FAB, Icon, useTheme } from "react-native-paper";
import { useCalculator } from "../../../../context/profileContext";


const BulletIcon = ({ size, color }) => {
    return (
        <View style={styles.bulletIcon}>
            <Icon size={size} color={color} source="bullet" />
        </View>
    )
}


const ProfileTitle = () => {
    const theme = useTheme();
    const { profileProperties } = useCalculator();

    const [profileData, setProfileData] = useState({
        profileName: profileProperties?.profileName || "",
        bulletName: profileProperties?.bulletName || "",
    });

    useEffect(() => {
        setProfileData({
            profileName: profileProperties?.profileName || "",
            bulletName: profileProperties?.bulletName || "",
        });
    }, [profileProperties]);

    const profileText = useMemo(
        () => `${profileData.profileName} ${profileData.bulletName}`,
        [profileData]
    );

    return (
        <View style={styles.container}>
            <Chip
                closeIcon="square-edit-outline"
                mode={"flat"}
                onClose={() => { }}
                style={[styles.chip]}
                disabled={true}
            >
                {profileText}
            </Chip>
            <FAB
                size="small"
                mode="flat"
                variant="secondary"
                animated={false}
                disabled={true}
                icon={({ size, color }) => <BulletIcon color={color} size={size} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    chip: {
        flex: 1,
        marginRight: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    bulletIcon: {
        transform: [{ rotate: "45deg" }],
    },
});

export default ProfileTitle;