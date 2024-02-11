javascript: (function () {
    const expandos = document.querySelectorAll("img.res-image-media");
    expandos.forEach(e => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = e.naturalWidth;
        canvas.height = e.naturalHeight;
        e.crossOrigin = "anonymous";
        e.onload = function () {
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            context.drawImage(e, 0, 0);
            e.src = canvas.toDataURL();
            e.onload = null;
        };
    });
})();
