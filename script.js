const colorPickerBtn = document.querySelector('#color-picker');
const colorList = document.querySelector('.all-colors');
const clearAll = document.querySelector('.clear-all');
const pickerdColors = JSON.parse(localStorage.getItem('picked-colors') || "[]");

function valueToHex(c) {
    return c.toString(16);

}

function rgbToHex(r, g, b) {
    return (valueToHex(r) + valueToHex(g) + valueToHex(b));
}

const copyColor = elem => {
    navigator.clipboard.writeText(elem.dataset.color).then(() => {
        elem.innerText = 'copied';
        setTimeout(() => elem.innerText = elem.dataset.color, 1000);

    })

}

const showColors = () => {
    if(!pickerdColors.length) return;
    colorList.innerHTML = pickerdColors.map(color => `
        <li class="color">
            <span class="rect" style="background: ${color}; border: 1px solid ${color === '#ffffff' ? '#ccc' : color}"></span>
            <span class="value" data-color="${color}">${color}</span>
        </li>
    `).join('');
    document.querySelector('.picked-colors').classList.remove('hide');
    document.querySelectorAll('.color').forEach(li => {
        li.addEventListener('click', e => copyColor(e.currentTarget.lastElementChild));
    })
}
showColors();

const activateEyeDropper = () => {
    document.body.style.display = 'none';
    setTimeout(async () => {
        try {
            let eyeDropper = new EyeDropper();
            const {sRGBHex} = await eyeDropper.open()
            await navigator.clipboard.writeText(sRGBHex);
            const [r, g, b, a] = sRGBHex.match(/\d+/g).map(Number);
            const hex = '#' + rgbToHex(r, g, b, a);

            if (!pickerdColors.includes(hex)) {
                pickerdColors.push(hex);
                localStorage.setItem('picked-colors', JSON.stringify(pickerdColors));
                showColors();
            }

        } catch (error) {
            console.log("Failed to copy color the code!");
        }
        document.body.style.display = 'block';
    }, 10)

}
const clearAllColors = () => {
    pickerdColors.length = 0;
    localStorage.setItem('picked-colors', JSON.stringify(pickerdColors));
    document.querySelector('.picked-colors').classList.add('hide');
    showColors();
}

clearAll.addEventListener('click', clearAllColors);
colorPickerBtn.addEventListener('click', activateEyeDropper);
