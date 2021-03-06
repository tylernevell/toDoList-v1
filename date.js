
// console.log(module);

// adding () will call it. We only want to pass it through
exports.getDate = () => {
    const today = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };

    return today.toLocaleDateString("en-US", options);
}

exports.getDay = () => {
    const today = new Date();

    const options = {
        weekday: "long",
    };

    return today.toLocaleDateString("en-US", options);
}