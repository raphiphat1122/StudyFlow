export const mascot = {
  reading: require('../assets/mascot/reading.png'), teaching: require('../assets/mascot/teaching.png'),
  heart: require('../assets/mascot/heart.png'), student: require('../assets/mascot/student.png'),
  laptop: require('../assets/mascot/laptop.png'), graduate: require('../assets/mascot/graduate.png'),
  greeting: require('../assets/mascot/greeting.png'), sleeping: require('../assets/mascot/sleeping.png'),
  idea: require('../assets/mascot/idea.png'), doubt: require('../assets/mascot/doubt.png'),
  goal: require('../assets/mascot/goal.png'), welcome: require('../assets/mascot/welcome.png'),
  nodata: require('../assets/mascot/nodata.png'),
} as const;
export type MascotName = keyof typeof mascot;
