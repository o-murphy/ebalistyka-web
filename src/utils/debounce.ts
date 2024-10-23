const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};


// const debounce = (func, delay) => {
//     let timer;
//     return function(...args) {
//         const context = this; // capture the context if necessary (useful for methods bound to objects)
//         clearTimeout(timer);  // Clear the previous timeout
//         timer = setTimeout(() => {
//             func.apply(context, args); // Call the function with the correct context and arguments
//         }, delay);
//     };
// };

export default debounce;
