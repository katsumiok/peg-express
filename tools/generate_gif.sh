#! /bin/sh

ffmpeg -i screen.mov -vf setpts=PTS/3.0 -af atempo=3.0 dest.mov
ffmpeg  -i dest.mov -r 10  screen.gif 
