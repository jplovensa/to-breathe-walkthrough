#!/usr/bin/env python3
"""Create the locally hosted catalogue film. Requires Python 3 and FFmpeg."""
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'public/video'
SCENES = [
    ('shelter.webp', 'To Breathe', 'to breathe.', 'A quieter way to live. Architecture by Fjäll Group. Interiors by SECHA.'),
    ('veil.webp', 'The philosophy', 'Less noise. More presence.', 'Light, air, and landscape shape a quieter experience of home.'),
    ('shelter.webp', 'Shelter of Sky', 'Shelter of Sky', 'Low, sweeping rooflines open the home to light, air, and garden.'),
    ('page-4.webp', 'Life outdoors', 'A sheltered openness.', 'Inside and outside connect through glazing, greenery, and soft curves.'),
    ('veil.webp', 'Veil of Light', 'Veil of Light', 'Layered arches soften the world and let the light through.'),
    ('page-6.webp', 'Exterior materials', 'Grounded in the natural.', 'Warm stucco, travertine, teak, and stone bring texture and calm.'),
    ('page-22.webp', 'Interior directions', 'A feeling, made tangible.', 'SECHA explores soft neutrals, natural textures, and crafted details.'),
    ('shelter.webp', 'Your vision', 'Your vision starts here.', 'Choose an architecture. Explore an interior. Make space for you.'),
]
SECONDS = 10
FPS = 24


def run(*args):
    subprocess.run(args, check=True)


def stamp(seconds):
    return f'{seconds // 3600:02}:{seconds // 60 % 60:02}:{seconds % 60:02}.000'


def main():
    if not shutil.which('ffmpeg'):
        raise SystemExit('Install FFmpeg to regenerate the walkthrough film.')
    OUTPUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='to-breathe-film-') as folder:
        work = Path(folder)
        clips = []
        for index, (image, name, title, caption) in enumerate(SCENES):
            source = ROOT / 'public/assets' / image
            if not source.is_file():
                raise SystemExit(f'Missing catalogue image: {source}')
            title_file = work / f'title-{index}.txt'
            caption_file = work / f'caption-{index}.txt'
            label_file = work / f'label-{index}.txt'
            title_file.write_text(title)
            caption_file.write_text(caption)
            label_file.write_text(f'TO BREATHE / SIGNATURE SERIES     {index + 1:02} / 08')
            output = work / f'scene-{index}.mp4'
            # Material boards stay intact; architectural renderings slowly move in.
            if image.startswith('page-'):
                motion = 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0xf3f1e9'
            else:
                motion = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='1+0.045*on/240':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=240:s=1280x720:fps=24"
            font = ROOT / 'public/fonts/dm-sans.ttf'
            filters = (
                motion + ',setsar=1,'
                'drawbox=x=0:y=0:w=iw:h=80:color=0x223126@0.64:t=fill,'
                f'drawtext=fontfile={font}:textfile={label_file}:fontcolor=0xf3f1e9:fontsize=15:x=44:y=32,'
                'drawbox=x=0:y=500:w=iw:h=220:color=0x223126@0.91:t=fill,'
                f'drawtext=fontfile={font}:textfile={title_file}:fontcolor=0xf3f1e9:fontsize=52:x=44:y=548,'
                f'drawtext=fontfile={font}:textfile={caption_file}:fontcolor=0xe2e5d8:fontsize=21:x=46:y=629,'
                'fade=t=in:st=0:d=0.45,fade=t=out:st=9.55:d=0.45,format=yuv420p'
            )
            print(f'Encoding {index + 1}/8: {name}', flush=True)
            run('ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-loop', '1', '-framerate', str(FPS),
                '-i', str(source), '-vf', filters, '-t', str(SECONDS), '-an', '-c:v', 'libx264',
                '-threads', '2', '-preset', 'fast', '-crf', '22', '-r', str(FPS), str(output))
            clips.append(output)
        concat = work / 'clips.txt'
        concat.write_text('\n'.join(f"file '{clip}'" for clip in clips))
        run('ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0',
            '-i', str(concat), '-c', 'copy', '-movflags', '+faststart', str(OUTPUT / 'to-breathe-walkthrough.mp4'))
        run('ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', '1',
            '-i', str(OUTPUT / 'to-breathe-walkthrough.mp4'), '-frames:v', '1', str(OUTPUT / 'poster.webp'))
    chapters = []
    cues = ['WEBVTT', '']
    for index, (_, name, title, caption) in enumerate(SCENES):
        start = index * SECONDS
        chapters.append({'title': name, 'start': start, 'description': caption})
        cues += [str(index + 1), f'{stamp(start)} --> {stamp(start + SECONDS)}', title.rstrip('.') + '. ' + caption, '']
    (OUTPUT / 'captions.vtt').write_text('\n'.join(cues))
    (ROOT / 'src/film-data.js').write_text('export const filmChapters = ' + json.dumps(chapters, indent=2) + ';\n')
    print(f'Created {len(SCENES) * SECONDS}-second 720p H.264 film at {OUTPUT}', flush=True)


if __name__ == '__main__':
    main()
