const saveBMPsize = (buffer, width, height) => {
    for(let i = 21; i >= 18; i--) {
        buffer[i] = Math.floor(width / Math.pow(16, 2*(i-18)));
        width -= buffer[i] * Math.pow(16, 2*(i-18));
    }

    for(let i = 25; i >= 22; i--) {
        buffer[i] = Math.floor(height / Math.pow(16, 2*(i-22)));
        height -= buffer[i] * Math.pow(16, 2*(i-22));
    }
}

export default saveBMPsize;