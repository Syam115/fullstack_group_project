module.exports = function calculateConsultationFee(doctor, appointmentCount = 0) {
    const baseFee = Number(doctor?.fee || 0);
    const loyaltyDiscount = appointmentCount >= 5 ? 0.1 : 0;
    return Number((baseFee * (1 - loyaltyDiscount)).toFixed(2));
};
