
let _init = {
  courseSchedule: 0,
  coursewareSchedule: 0,
  studyLastScale: 4000,
  studyCurrentScale: 4000,
  studySchedule: 100
}
this.player.getTime = () => 4000;
this.serverEndData.core.studyCurrentScale = 4000;
this.serverEndData.core.studySchedule = 100;
Object.assign(this.server.server_study_info, _init)
t = 100;

e = {
  courseSchedule: 0,
  coursewareSchedule: 0,
  studyLastScale: 4000,
  studyCurrentScale: 4000,
  studySchedule: 100
}

t.data.data.core.courseSchedule = 0;
t.data.data.core.coursewareSchedule = 0;
t.data.data.core.studyLastScale = 4000;
t.data.data.core.studyCurrentScale = 4000;
t.data.data.core.studySchedule = 100;