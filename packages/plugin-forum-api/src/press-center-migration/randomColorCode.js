const maxVal = 0xff+1;

const randomVal = () => {
    const random = Math.floor(Math.random() * maxVal);
    const unpadded = Math.floor(random).toString(16);
    const padded = ("00" + unpadded).slice(-2);
    return padded.toUpperCase();
}

const randomColorCode = () => {
    return `#${randomVal()}${randomVal()}${randomVal()}`;
}

module.exports = randomColorCode;