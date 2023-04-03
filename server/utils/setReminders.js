const setReminders = (epochDead, current) => {
  let interval = (epochDead - current) / 4;
  return [
    new Date(current + interval),
    new Date(current + interval * 2),
    new Date(current + interval * 3),
  ];
};

export default setReminders;
