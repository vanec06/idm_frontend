
export const ConvertirArchivo = (event) => {
    return new Promise((resolve, reject) => {
        const archivo = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(archivo);
    });
};