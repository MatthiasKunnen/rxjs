import { TestMessage } from 'rxjs/internal/testing/TestMessage';

function getMarble(message: TestMessage) {
  return message.notification.hasValue
    ? message.notification.value
    : message.notification.kind;
}

/**
 * Repeats the given string x times.
 * No longer needed when targeting es6.
 */
function repeat(string: string, times: number): string {
  let output = '';

  while (times > 0) {
    output += string;
    --times;
  }

  return output;
}

/**
 * Generates marbles based on messages.
 */
export function getMarbles(messages: Array<TestMessage>, timeFactor = 10): string {
  let output = '';

  if (messages.length > 0 && messages[0].frame > 0) {
    output += repeat('-', messages[0].frame / timeFactor);
  }

  for (let i = 0; i < messages.length; i++) {
    const curr = messages[i];
    const next = messages[i + 1];

    if (next === undefined) {
      output += getMarble(curr);
      continue;
    }

    if (curr.frame !== next.frame) {
      output += getMarble(curr);
      output += repeat('-', (next.frame - curr.frame - timeFactor) / timeFactor);
    } else {
      output += '(' + getMarble(curr);

      let lookAheadIndex = i;
      let lookAhead;
      do {
        ++lookAheadIndex;
        lookAhead = messages[lookAheadIndex];

        if (lookAhead === undefined) {
          break;
        }

        output += getMarble(lookAhead);
      } while (lookAhead.frame === curr.frame);

      output += ')';
      i = lookAheadIndex;
    }
  }

  return output;
}
