# and-sub-encoder
x86 ASCII AND-SUB Encoder

## Try it online

https://iwantmore.pizza/posts/and-sub-encoder.html

## Usage

```
$ ts-node index.ts

and eax, 0x20202020
and eax, 0x40404040 ; eax = 0x0
sub eax, 0x24554420
sub eax, 0x7e7e7e73
sub eax, 0x7e7e7e7e ; eax = 0xdeadbeef

payload length: 150
push eax
pop ebx
sub eax, 0x20202020
sub eax, 0x61616120
sub eax, 0x7e7e7e71 ; eax += 0x4f
push eax
pop esp
and eax, 0x20202020
and eax, 0x40404040 ; eax = 0x0
sub eax, 0x20202020
sub eax, 0x20202051
sub eax, 0x7d7d7d7e ; eax = 0x42424211
push eax
and eax, 0x20202020
and eax, 0x40404040 ; eax = 0x0
sub eax, 0x2020204c
sub eax, 0x402e207e
sub eax, 0x7d7e7a7e ; eax = 0x223344b8
push eax
dec ecx
dec ecx
dec ecx
dec ecx
dec ecx
dec ecx
dec ecx
dec ecx

```
