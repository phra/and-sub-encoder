#include <string.h>
#include <stdio.h>
// gcc -m32 -z execstack -o test test.c && gdb ./test

__attribute__((naked))
int generated() {
  asm volatile(
    "mov $0xffffd010, %eax\n" // start of encoder in eax
    "int $0x3\n"
    //"push %eax\n"
    //"pop %ebx\n"
    "subl $0x20202020, %eax\n" // +5
    "subl $0x61616120, %eax\n" // +5
    "subl $0x7e7e7e73, %eax\n" // +5 ; eax += 0x4d
    "push %eax\n"
    "pop %esp\n"
    "andl $0x20202020, %eax\n" // +5
    "andl $0x40404040, %eax\n" // +5
    "subl $0x20202020, %eax\n" // +5
    "subl $0x20202051, %eax\n" // +5
    "subl $0x7d7d7d7e, %eax\n" // +5 ; eax = 0x42424211
    "push %eax\n"
    "andl $0x20202020, %eax\n" // +5
    "andl $0x40404040, %eax\n" // +5
    "subl $0x2020204c, %eax\n" // +5
    "subl $0x402e207e, %eax\n" // +5
    "subl $0x7d7e7a7e, %eax\n" // +5 ; eax = 0x223344b8
    "push %eax\n"
    "dec %ecx\n"
    "dec %ecx\n"
    "dec %ecx\n"
    "dec %ecx\n"
    "dec %ecx\n"
    "dec %ecx\n"
    "dec %ecx\n"
    "dec %ecx\n"
    );
}

__attribute__((naked))
int shellcode() {
  asm volatile(
    //"mov $0xffffd0a0, %eax\n"
    "mov $0xffffd070, %eax\n" // start of encoder in eax
    "int $0x3\n"
    "push %eax\n" // loaded at 0xffffd070, +1
    "pop %ebx\n" // +1
    "subl $0x20202020, %eax\n" // +5
    "subl $0x61616132, %eax\n" // +5
    "subl $0x7e7e7e7e, %eax\n" // +5 ; eax += 0x30
    "push %eax\n" // +1
    "pop %esp\n" // +1
    "andl $0x20202020, %eax\n" // +5
    "andl $0x40404040, %eax\n" // +5
    "subl $0x36372020, %eax\n" // +5
    "subl $0x7e7e2120, %eax\n" // +5
    "subl $0x7e7e2e30, %eax\n" // +5 ; eax = 0xcccc9090
    "push %eax\n" // +1
    "dec %ecx\n" // +1 => nop
    "dec %ecx\n" // +1 => nop
    "dec %ecx\n" // +1 => int3
    "dec %ecx\n" // +1 => int3 ; 0xffffd0a0 offset from start: +48 (4 bytes written) = +26+4 for each 4 bytes
    "ret\n"
    );
}

int main(int argc, const char* argv[]) {
    const int length = 200;
    char exec[length];
    printf("addr of shellcode: %p\n", generated);
    fflush(stdout);
    memcpy(exec, generated, length);
    /*
    gef➤  disassemble shellcode 
    Dump of assembler code for function shellcode:
    0x000011b9 <+0>:	call   0x12a8 <__x86.get_pc_thunk.ax>
    0x000011be <+5>:	add    eax,0x2e42
    0x000011c3 <+10>:	mov    eax,0x565561bd
    0x000011c8 <+15>:	int3
    */
    ((void(*)())exec + 10)();
    return 0;
}
