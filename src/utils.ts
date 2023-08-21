import * as core from '@actions/core';
import { Options } from './validate';
import * as exec from '@actions/exec';

export const isNullOrEmpty = (string: string | undefined | null): boolean => {
  return !string;
}

export const isStringBoolean = (string: string): boolean => {
  if (isNullOrEmpty(string)) { return false; }
  const value = string.toLowerCase();
  return (value === 'true') || (value === 'false');
}

export const getOptions = (optionsList: string[]): Options => {
  if (optionsList.length === 0) { throw new Error('Option names are required'); }

  const options = Object.create(null);
  optionsList.forEach(element => {
    const value = core.getInput(element, { trimWhitespace: true });
    options[element] = isStringBoolean(value) ? value.toLowerCase() === 'true' : value;
  });
  return options;
};

export const execCommand = async (command: string) => {
  let stdout: string = '';

  const options: exec.ExecOptions = {
    listeners: {
      stdout: (data: Buffer) => {
        stdout += data.toString();
      }
    }
  }

  await exec.exec(command, [], options);

  return { stdout };
}
