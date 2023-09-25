FROM enth idum

RUN git clone https://github.com/IRONMAN444FF/Jarvis-MD /root/Jarvis-MD
WORKDIR /root/Jarvis-MD/
RUN yarn install --network-concurrency 1
CMD ["node", "index.js","node ."]
