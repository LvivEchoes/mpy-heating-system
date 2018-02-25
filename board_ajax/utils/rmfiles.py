import os


def rm(path):
    os.chdir(path)
    print('Watching {}'.format(path))
    for x in os.listdir(path):
        try:
            print('Trying to remove {}'.format(x))
            os.remove(x)
            print('# Removed {}'.format(x))
        except:
            print('{} is folder. Trying to remove files in folder.'.format(x))
            if path is '/':
                path = ''
            rm(path + '/' + x)
            os.chdir('..')
            os.rmdir(path + '/' + x)
            print('# Removed dir {}'.format(path + '/' + x))
