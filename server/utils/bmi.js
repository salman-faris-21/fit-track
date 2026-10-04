export const calculateBMI = (weight, heightCm) => {
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);

  let category = "";

  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  return {
    bmi: bmi.toFixed(2),
    category,
  };
};
