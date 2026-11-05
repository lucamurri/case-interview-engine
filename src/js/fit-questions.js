/**
 * fit-questions.js — original fit (behavioral) interview content.
 *
 * Eight themes, each with a coach's note and a bank of questions.
 * Written from scratch for this project; not copied from any firm or casebook.
 */

export const FIT_THEMES = {
  leadership: {
    name: 'Leadership',
    blurb: 'Moving a group toward a goal without being handed authority.',
    listenFor: 'A specific moment where you chose a direction, brought others along and owned the result. "I" matters more than "we" here, but credit your team honestly.',
    questions: [
      'Tell me about a time you led a group of people who did not report to you.',
      'Describe a time you took charge of something nobody had asked you to run.',
      'Tell me about a time you had to rally a team after a setback.',
      'Describe a time you changed the direction of a project that was already underway.',
      'Tell me about the most difficult person you have had to lead, and what you did.',
      'Describe a time you gave a teammate hard feedback.',
    ],
  },
  teamwork: {
    name: 'Teamwork & conflict',
    blurb: 'Working with people you did not choose, and disagreeing well.',
    listenFor: 'Real tension, handled with respect. Avoid stories where the other person was simply wrong; show that you understood their view and still moved things forward.',
    questions: [
      'Tell me about a disagreement with a colleague and how you resolved it.',
      'Describe a time you worked on a team where one member was not pulling their weight.',
      'Tell me about a time you had to work closely with someone whose style was very different from yours.',
      'Describe a time you disagreed with your manager or a senior person.',
      'Tell me about a team that did not work well. What was your part in that?',
      'Describe a time you helped a struggling teammate succeed.',
    ],
  },
  impact: {
    name: 'Impact & achievement',
    blurb: 'Results you are proud of, and why they mattered.',
    listenFor: 'A result with a number or a clear before and after, plus what would not have happened without you.',
    questions: [
      'Tell me about the accomplishment you are most proud of.',
      'Describe a time you exceeded what was expected of you.',
      'Tell me about a time you improved a process or result that others had accepted as "just how it is".',
      'Describe a project where you made a measurable difference.',
      'Tell me about a time you achieved something with far fewer resources than you wanted.',
    ],
  },
  failure: {
    name: 'Failure & feedback',
    blurb: 'Mistakes, criticism and what you changed afterward.',
    listenFor: 'A real mistake (not a disguised strength), your honest role in it, and a specific habit you changed. Defensiveness is the red flag.',
    questions: [
      'Tell me about a time you failed.',
      'Describe the most useful critical feedback you have ever received. What did you do with it?',
      'Tell me about a decision you made that turned out to be wrong.',
      'Describe a time you missed an important deadline or commitment.',
      'Tell me about a time you were out of your depth.',
    ],
  },
  ambiguity: {
    name: 'Problem solving & ambiguity',
    blurb: 'Making progress when the path is unclear.',
    listenFor: 'How you structured a messy problem, what you chose to ignore and how you checked your thinking. This is the closest fit theme to the case itself.',
    questions: [
      'Tell me about a time you had to solve a problem with very little information.',
      'Describe a time you used data to change someone\'s mind.',
      'Tell me about the hardest analytical problem you have worked on.',
      'Describe a time you had to make a decision without being able to get everything you wanted to know.',
      'Tell me about a time you broke a big, vague goal into concrete steps.',
    ],
  },
  influence: {
    name: 'Influence & persuasion',
    blurb: 'Changing minds when you cannot give orders.',
    listenFor: 'That you understood what the other side cared about, not just what you wanted. The best answers adapt the message to the audience.',
    questions: [
      'Tell me about a time you persuaded someone who initially disagreed with you.',
      'Describe a time you had to sell an idea to a skeptical senior audience.',
      'Tell me about a time you got a result by influencing someone you had no power over.',
      'Describe a time you had to deliver bad news to someone.',
      'Tell me about a time you had to explain something complex to a non-expert.',
    ],
  },
  initiative: {
    name: 'Initiative & resilience',
    blurb: 'Starting things, and persisting when they get hard.',
    listenFor: 'What drove you to act without being asked, and how you kept going when it got uncomfortable. Pace and stamina matter in consulting.',
    questions: [
      'Tell me about something you started on your own.',
      'Describe a time you kept going when a project looked like it would fail.',
      'Tell me about a time you juggled several demanding priorities at once.',
      'Describe a time you had to learn something difficult very quickly.',
      'Tell me about the hardest stretch of work you have been through and how you got through it.',
    ],
  },
  motivation: {
    name: 'Motivation & fit',
    blurb: 'Why consulting, why this firm and what you will bring.',
    listenFor: 'A reason that is specific, believable and about the work, not the brand or the pay. Connect it to evidence from your own history.',
    questions: [
      'Why consulting?',
      'Why this firm rather than another?',
      'Where do you see yourself in five years, and how does this role help?',
      'What would the people who know you best say is your biggest weakness?',
      'What do you want to be better at a year from now?',
      'Walk me through your resume.',
    ],
  },
};

/** Self-score dimensions, each 1–5. */
export const FIT_RUBRIC = [
  { key: 'relevance', name: 'Answered the question', hint: 'Did the story actually fit what was asked, and did you open with the point?' },
  { key: 'structure', name: 'Structure', hint: 'Situation briefly, then your actions, then the result. Easy to follow, no rambling.' },
  { key: 'ownership', name: 'Ownership', hint: 'Was it clear what you personally did and decided, as opposed to what "we" did?' },
  { key: 'impact', name: 'Impact', hint: 'Did you state a concrete result, ideally with a number, and what it meant?' },
  { key: 'reflection', name: 'Reflection', hint: 'Did you say what you learned or would do differently, and keep it to about two minutes?' },
];

/** Short notes on the structure to use. */
export const FIT_TIPS = [
  { name: 'Situation (10–15 seconds)', text: 'One or two sentences of context: where, when, what was at stake. Cut everything the listener does not need.' },
  { name: 'Task', text: 'What you specifically were responsible for or trying to achieve. If you were not in charge, say what you chose to own.' },
  { name: 'Action (the bulk of the answer)', text: 'Two or three concrete steps you took, and why you chose them. This is where interviewers learn how you think.' },
  { name: 'Result', text: 'What happened, with a number if you have one. Be honest about partial results.' },
  { name: 'Lesson', text: 'One sentence on what you took from it. For failure questions, make this the strongest part.' },
];

/** Total number of questions. */
export const fitQuestionCount = () => Object.values(FIT_THEMES).reduce((n, t) => n + t.questions.length, 0);
