# Результаты сборки приложения

## Client

Директория `/dist/client` является публичной (document_root, public, www) для http сервера. 

Файл `/dist/client/index.html` должен отдаваться http сервером при любом запросе.

## Server

Директория `/dist/server` содержит сборку приложения для серверного рендера. 
Для исполнения на node.js в режиме production.
