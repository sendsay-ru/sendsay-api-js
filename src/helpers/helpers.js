export function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        '(?:^|\\s)' + name.replace(/([.$?*+\\\\/{}|()\\[\]^])/g, '\\$1') + '=(.*?)(?:;|$)'))
    return matches ? matches[1] : undefined
}


export function isJsonString(str) {
    try {
        JSON.parse(str)
    } catch (e) {
        return false
    }
    return true
}


export function getAuthLocalStorageData() {
    let login = localStorage.getItem(`login`)
    let subLogin = localStorage.getItem(`subLogin`)
    let password = localStorage.getItem(`password`)

    let obj = {
        login,
        subLogin,
        password
    }

    return obj
}


export function writeToBufer(data) {
    navigator.clipboard.writeText(data)
        .then(() => {
            navigator.clipboard.readText()
        })
        .catch(err => {
            console.log('Something went wrong', err)
        })
}


export function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen()
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen()
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen()
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen()
    }
}


export function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
    }
}