#!/bin/bash
export _JAVA_OPTIONS='-Dsun.java2d.opengl=true -Dawt.useSystemAAFontSettings=on -Dswing.aatext=true -Dswing.defaultlaf=javax.swing.plaf.nimbus.NimbusLookAndFeel'
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export DYLD_LIBRARY_PATH=/opt/homebrew/lib
export SHUT_UP_TACHI=yes
cd "$(dirname "$0")"
exec java -Djava.library.path=./nativeLibs -Xms1g -Xmx4g -cp "lr2oraja.jar:ir/bokutachiIR-3.1.0.jar" bms.player.beatoraja.MainLoader