#!/usr/bin/env python3

# Start the Webpack dev server on :8005
# Start the Go server on :8004

import subprocess as sub
from pyfiglet import Figlet
import os
import sys

def clear():
    if os.name == 'nt':
        return '\x1B[2J\x1B[0f'
    else:
        return '\x1B[2J\x1B[3J\x1B[H'

def blue(s, end = '\n'):
    return '\033[1;34m' + s.strip() + '\x1b[0m' + end

def yellow(s, end = '\n'):
    return '\033[93m' + s.strip() + '\x1b[0m' + end

puts = sys.stdout.write
devnull = open(os.devnull, 'w')

puts(clear())

puts(
    '    ' +
    yellow(
        Figlet(font='slant').renderText('fbpedia')
    ) + '\n\n' +

    'App available at \033[1mhttp://localhost:8005\033[0m\n\n'

    'You are running the \033[1mdevelopment\033[0m server for\n' +
    'fbpedia. To create a production build, run\n' +
    'the script ' + yellow('./scripts/build.py', end='') + '.\n\n'
)

client = sub.Popen(
    [
        'webpack-dev-server',
        '--port',           '8005',
        '--content-base',   'client/',
        '--config',         'client/webpack.config.js'
    ],
    stdout=devnull,
    stderr=sub.STDOUT,
)
puts(
    blue('Running client on    :8005')
)

server = sub.Popen(
    [
        'realize', 'start',
        '--run', '8004'
    ],
    stdout=devnull,
    stderr=sub.STDOUT,
    cwd='api',
)
puts(
    blue('Running API on       :8004')
)

puts('\nType Command + C to end\n\n')

try:
    client.wait()
    server.wait()

except KeyboardInterrupt:
    sys.exit(0)
