import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Dimensions, StyleSheet, Animated } from 'react-native';
import { Icon, IconButton, Surface, useTheme } from 'react-native-paper';

// const screenWidth = Dimensions.get('window').width;

const StaticDot = ({ active }) => {
    const theme = useTheme();
    return (
        <View
            style={[
                styles.dot,
                { backgroundColor: theme.colors.onPrimaryContainer },
                { opacity: active ? 1 : 0.3, width: active ? 16 : 8 },
            ]}
        />
    )
}

const AnimatedDot = ({ active }) => {
    const theme = useTheme();

    // Initialize animated values
    const animatedOpacity = useRef(new Animated.Value(active ? 1 : 0.3)).current;
    const animatedWidth = useRef(new Animated.Value(active ? 16 : 8)).current;

    // Effect to animate changes when `active` state changes
    useEffect(() => {
        Animated.timing(animatedOpacity, {
            toValue: active ? 1 : 0.3,
            duration: 200,
            useNativeDriver: false,
        }).start();

        Animated.timing(animatedWidth, {
            toValue: active ? 16 : 8,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [active]);

    return (
        <Animated.View
            style={[
                styles.dot,
                {
                    backgroundColor: theme.colors.onPrimaryContainer,
                    opacity: animatedOpacity,
                    width: animatedWidth,
                },
            ]}
        />
    );
};


const Indicator = ({ data, activeIndex, animated = false }) => {

    return (
        <View style={styles.pagination}>
            {data.map((_, index) => (
                animated ? <AnimatedDot key={index} active={index === activeIndex} />
                    : <StaticDot key={index} active={index === activeIndex} />
            ))}
        </View>
    )
}


const CarouselView = ({ children }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [layoutWidth, setLayoutWidth] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const data = children.map((child, index) => {
        return { key: index, content: child }
    })

    const handleScroll = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / layoutWidth);
        setActiveIndex(index);
    };

    // useEffect(() => {
    //     console.log(activeIndex, flatListRef.current)
    //     flatListRef.current.scrollToIndex({ index: activeIndex, animated: true });
    // }, [activeIndex])

    const handleLayout = (event) => {
        setLayoutWidth(event.nativeEvent.layout.width)
    }

    const renderItem = ({ item }) => (
        <Surface style={[styles.card, {width: layoutWidth}]} elevation={0}>
            {item.content}
        </Surface>
    );

    const onLeftBtn = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1)
            flatListRef.current.scrollToIndex({ index: activeIndex - 1, animated: true });

        }
    }

    const onRightBtn = () => {
        if (activeIndex < data.length - 1) {
            setActiveIndex(activeIndex + 1)
            flatListRef.current.scrollToIndex({ index: activeIndex + 1, animated: true });

        }
    }

    return (
        <View onLayout={handleLayout}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <IconButton icon={"chevron-left"} size={24} style={{ height: 24 }} onPress={onLeftBtn} disabled={!(activeIndex > 0)} />
                <Indicator data={data} activeIndex={activeIndex} animated />
                <IconButton icon={"chevron-right"} size={24} style={{ height: 24 }} onPress={onRightBtn} disabled={!(activeIndex < data.length - 1)} />
            </View>

            <FlatList
                ref={flatListRef}
                data={data}
                horizontal
                pagingEnabled
                onScroll={handleScroll}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
                showsHorizontalScrollIndicator={false}

                getItemLayout={(data, index) => ({ length: layoutWidth, offset: layoutWidth * index, index })}

            />

        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 0,
    },
    content: {
        fontSize: 16,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
});

export default CarouselView;