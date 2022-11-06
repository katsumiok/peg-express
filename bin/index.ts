// Copyright 2022 Katsumi Okuda
import commandLineArgs from 'command-line-args';
import { generateFiles } from './generateFiles';

const optionDefinitions = [
  { name: 'output', alias: 'o', type: String },
  { name: 'grammar', type: String, multiple: false, defaultOption: true },
];

const x = commandLineArgs(optionDefinitions);
if (x['grammar']) {
  generateFiles(x['grammar']);
}
