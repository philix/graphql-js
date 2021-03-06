/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import { getLocation } from '../language/location';
import type { Source } from '../language/source';
import { GraphQLError } from './GraphQLError';

/**
 * Produces a GraphQLError representing a syntax error, containing useful
 * descriptive information about the syntax error's position in the source.
 */
export function syntaxError(
  source: Source,
  position: number,
  description: string
): GraphQLError {
  var location = getLocation(source, position);
  var error = new GraphQLError(
    `Syntax Error ${source.name} (${location.line}:${location.column}) ` +
    description + '\n\n' + highlightSourceAtLocation(source, location),
    undefined,
    undefined,
    source,
    [ position ]
  );
  return error;
}

/**
 * Render a helpful description of the location of the error in the GraphQL
 * Source document.
 */
function highlightSourceAtLocation(source, location) {
  var line = location.line;
  var prevLineNum = (line - 1).toString();
  var lineNum = line.toString();
  var nextLineNum = (line + 1).toString();
  var padLen = nextLineNum.length;
  var lines = source.body.split(/\r\n|[\n\r\u2028\u2029]/g);
  return (
    (line >= 2 ?
      lpad(padLen, prevLineNum) + ': ' + lines[line - 2] + '\n' : '') +
    lpad(padLen, lineNum) + ': ' + lines[line - 1] + '\n' +
    Array(2 + padLen + location.column).join(' ') + '^\n' +
    (line < lines.length ?
      lpad(padLen, nextLineNum) + ': ' + lines[line] + '\n' : '')
  );
}

function lpad(len, str) {
  return Array(len - str.length + 1).join(' ') + str;
}
