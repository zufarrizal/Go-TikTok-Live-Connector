@echo off
rmdir /s /q world 2>nul
rmdir /s /q world_nether 2>nul
rmdir /s /q world_the_end 2>nul
java -Xms4G -Xmx4G -jar paper.jar --nogui
pause
