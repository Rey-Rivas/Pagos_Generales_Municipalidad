const message = 'Hello world' // Try edit me

// Update header text
document.querySelector('#header').innerHTML = message

function validateRut(rut) {
    rut = rut.replace(/[.]/g, "");
    const [rutNumber, verifierDigit] = rut.split("-");

    rut = rut.replace(/[-]/g, "");

    const verifierNumber = verifierDigit.toUpperCase() === "K" ? 10 : parseInt(verifierDigit);

    let sum = 0;
    let multiplier = 2;
    for (let i = rutNumber.length - 1; i >= 0; i--) {
        sum += parseInt(rutNumber.charAt(i)) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    let calculatedVerifierDigit = 11 - (sum % 11);
    if (calculatedVerifierDigit === 11) {
        calculatedVerifierDigit = 0;
    } else if (calculatedVerifierDigit === 10) {
        calculatedVerifierDigit = 'K';
    }

    return verifierNumber === calculatedVerifierDigit;
}

console.log(validateRut("20915490-0")); // Now it should return true if "20915490-0" is a valid RUT