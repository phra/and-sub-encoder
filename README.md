# and-sub-encoder
x86 ASCII AND-SUB Encoder

## Try it online

https://iwantmore.pizza/posts/and-sub-encoder.html

## Usage

```
$ ts-node index.ts 0xdeadbeef
encoding 0xdeadbeef

and eax, 0x20202020
and eax, 0x40404040 ; eax = 0x0
sub eax, 0x24554420
sub eax, 0x7e7e7e73
sub eax, 0x7e7e7e7e ; eax = 0xdeadbeef
```
