import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { Chip, Icon, Surface } from "react-native-paper";
import { useProfile } from "../../../../context/profileContext";
import { useNavigation } from "@react-navigation/native";


const BulletIcon = ({ size, color }) => {
    return (
        <Surface style={styles.bulletIcon} elevation={0}>
            <Icon size={size} color={color} source="bullet" />
        </Surface>
    )
}


const ProfileTitle = () => {
    const { profileProperties } = useProfile();

    const navigation = useNavigation()

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
        <Surface style={styles.container} elevation={0}>
            <Chip
                closeIcon="square-edit-outline"
                mode={"flat"}
                icon={({ size, color }) => <BulletIcon color={color} size={size} />}
                onPress={() => navigation.navigate("Profile")}
                onClose={() => navigation.navigate("Profile")}
                style={[styles.chip]}
                // disabled={true}
            >
                {profileText}
            </Chip>
            {/* <FAB
                size="small"
                mode="flat"
                variant="secondary"
                animated={false}
                disabled={true}
                icon={({ size, color }) => <BulletIcon color={color} size={size} />}
            /> */}
        </Surface>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    chip: {
        flex: 1,
        // marginRight: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    bulletIcon: {
        transform: [{ rotate: "45deg" }],
    },
});

export default ProfileTitle;