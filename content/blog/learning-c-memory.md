---
title: "Learning C: Memory Management"
description: "How to manage memory safely and efficiently in C."
date: "2024-06-03"
tags: ["C", "memory", "malloc", "free"]
---

# Learning C: Memory Management

> "With great power comes great responsibility." — Uncle Ben (and every C programmer)

## Dynamic Memory Allocation

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr = malloc(5 * sizeof(int));
    if (arr == NULL) {
        // Always check for allocation failure!
        return 1;
    }
    for (int i = 0; i < 5; i++) arr[i] = i * i;
    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);
    free(arr);
    return 0;
}
```

## Key Points
- Use `malloc`, `calloc`, `realloc` for dynamic memory
- Always `free` what you allocate
- Avoid memory leaks and dangling pointers

## Further Reading
- [C Programming: Dynamic Memory](https://www.tutorialspoint.com/cprogramming/c_dynamic_memory_allocation.htm)