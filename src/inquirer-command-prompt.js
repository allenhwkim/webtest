/**
 * inquirer `command` type prompt
 * It works the same as `input` type prompt, plus;
 *
 *  1. It auto fill commands when UP/DOWN arrow is pressed
 *  2. It auto fill commands when TAB is entered
 *  3. It saves the history to ~/.config/preferences
 */
var util = require('util');
var InputPrompt = require('inquirer/lib/prompts/input');
var Preferences = require('preferences');

var commands = new Preferences('inquirer-command', { history: [] });
var numCommandsHistory = commands.history.length;
var currentNdx = numCommandsHistory;

module.exports = CommandPrompt;

function CommandPrompt() {
  return InputPrompt.apply(this, arguments);
}
util.inherits(CommandPrompt, InputPrompt);

CommandPrompt.prototype.onEnd = function (state) {
  this.answer = state.value;
  this.status = 'answered';

  this.render(); // Re-render prompt

  this.screen.done();
  this.done(state.value);

  // Save the answer to history
  commands.history.push(this.answer);
  if (commands.history.length > 20) { // limit history, why 100? no reason
    commands.history = commands.history.slice(1,21);
  }
  currentNdx = numCommandsHistory = commands.history.length;
};

CommandPrompt.prototype.onKeypress = function (e) {
  /** go up commands history */
  if (e.key.name === 'up') {
    currentNdx--;
    (currentNdx < 0) && (currentNdx += numCommandsHistory); //prevents negative value
    this.rl.line = commands.history[currentNdx % numCommandsHistory];
    this.rl.write(null, {ctrl: true, name: 'e'});
  }
  /** go down commands history */
  else if (e.key.name === 'down') {
    currentNdx++;
    this.rl.line = commands.history[currentNdx % numCommandsHistory];
    this.rl.write(null, {ctrl: true, name: 'e'});
  }
  /** search for matching history */
  else if (e.key.name === 'tab') {
    var matchingHistory = commands.history.find(el => {
      return el.match(new RegExp(`^${this.rl.line.replace(/\t/,'')}`));
    });
    if (matchingHistory) {
      this.rl.line = matchingHistory;
      this.rl.write(null, {ctrl: true, name: 'e'});
    }
  }
  this.render(); // Re-render prompt
};
