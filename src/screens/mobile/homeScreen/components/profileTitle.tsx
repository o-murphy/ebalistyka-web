import { StyleSheet, View } from "react-native"
import { Chip, FAB, Icon } from "react-native-paper"
import { useTheme } from "../../../../context/themeContext"
import { useCalculator } from "../../../../context/profileContext"
import { useEffect, useState } from "react"



export const ProfileTitle = () => {
    const {theme} = useTheme()
    const {profileProperties} = useCalculator()

    const [profileName, setProfileName] = useState(null)
    const [bulletName, setBulletName] = useState(null)

    useEffect(() => {
        setProfileName(profileProperties?.profileName)
    }, [profileProperties?.profileName])

    useEffect(() => {
        setBulletName(profileProperties?.bulletName)
    }, [profileProperties?.bulletName])

    return (
        <View style={{
            flexDirection: "row", justifyContent: "center", paddingHorizontal: 16
        }}>
            <Chip
                closeIcon={"square-edit-outline"}
                onClose={() => { }}
                style={styles.chipStyle}
            >
                {`${profileName} ${bulletName}`}
            </Chip>
            <FAB
                size="small"
                mode={"flat"}
                animated={false}
                icon={() => (
                    <View style={styles.bulletIconStyle}>
                        <Icon size={28} source={"bullet"} color={theme.colors.secondary} />
                    </View>
                )}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    chipStyle: { 
        flex: 1, 
        marginRight: 8, 
        justifyContent: "center", 
        alignItems: "center" 
    },
    bulletIconStyle: {
        transform: [
            // { translateX: -1 }, // Half the width of the icon
            // { translateY: -4 }, // Half the height of the icon
            { rotate: '45deg' }, // Rotate
        ],
    },
})