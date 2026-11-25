---
layout: post
title: "선형대수와 군 1장: 동치류와 분할"
date: 2026-11-25 00:01:00 +0900
description: "동치관계가 집합을 분할하는 이유를 증명하고, 합동식과 선형사상의 핵, 군의 잉여류에 연결한다."
tags: math linear-algebra group-theory
categories: Mathematics
---

사실 1장의 내용은 앞에 더 많지만 다른 교과서에도 나올 내용이라 아래의 내용만 정리한다.

수학에서는 서로 다른 두 대상을 어떤 기준에서 같다고 취급한다. 예를 들어 정수 1과 7은 서로 다른 수지만, 3으로 나눈 나머지는 같다. 이렇게 **같다고 보는 기준**을 동치관계라고 하고, 그 기준으로 묶인 원소들의 집합을 동치류라고 한다.

이 글에서는 동치관계와 분할이 서로 어떻게 대응하는지 증명하고, 이 아이디어가 선형대수와 군론에서 어떻게 나타나는지 살펴본다.

## 1. 관계와 동치관계

집합 $X$ 위의 관계는 $X$의 두 원소 사이에 어떤 조건이 성립하는지를 나타낸다. $a$와 $b$가 관계에 있을 때 $a\sim b$라고 쓰자.

관계 $\sim$이 다음 세 조건을 만족하면 **동치관계(equivalence relation)**라고 한다.

1. **반사성:** 모든 $a\in X$에 대해 $a\sim a$.
2. **대칭성:** $a\sim b$이면 $b\sim a$.
3. **추이성:** $a\sim b$이고 $b\sim c$이면 $a\sim c$.

세 조건은 우리가 흔히 생각하는 “같다”는 관계의 성질을 추상화한다. 다만 실제로 같은 원소일 필요는 없다. 어떤 정보를 무시할 때 구별되지 않으면 동치로 볼 수 있다.

### 예제: 정수의 합동

$n$을 양의 정수라 하자. 정수 $a,b$에 대해

$$
a\sim b \quad\Longleftrightarrow\quad n\mid(a-b)
$$

로 정의하면 이는 동치관계다. 보통 $a\equiv b\pmod n$으로 쓴다.

- $a-a=0$이므로 $n\mid(a-a)$: 반사성.
- $n\mid(a-b)$이면 $n\mid(b-a)$: 대칭성.
- $n\mid(a-b)$이고 $n\mid(b-c)$이면 $n\mid(a-c)$: 추이성.

예를 들어 $7\equiv1\pmod 3$이다. 두 수의 차 $7-1=6$이 3의 배수이기 때문이다.

## 2. 동치류란?

동치관계 $\sim$이 주어졌을 때 $a\in X$의 **동치류(equivalence class)**는 $a$와 동치인 모든 원소의 집합이다.

$$
[a]=\{x\in X\mid x\sim a\}.
$$

$a$를 이 동치류의 **대표원(representative)**이라고 한다. 반사성에 의해 $a\in[a]$이므로 동치류는 항상 공집합이 아니다.

### 예제: 3을 법으로 하는 동치류

$\mathbb Z$에서 3을 법으로 하는 합동을 생각하자.

$$
[0]=\{\ldots,-6,-3,0,3,6,\ldots\},
$$

$$
[1]=\{\ldots,-5,-2,1,4,7,\ldots\},
$$

$$
[2]=\{\ldots,-4,-1,2,5,8,\ldots\}.
$$

모든 정수는 이 세 집합 중 하나에 속한다. 예를 들어 $7\in[1]$이고, $7$을 대표원으로 골라도 같은 집합이므로 $[7]=[1]$이다.

> $7$과 $1$은 서로 다른 원소지만, $[7]$과 $[1]$은 같은 **집합**이다. 동치와 실제 원소의 동일함을 구분하자.

### 핵심 성질: 동치류는 같거나 서로소다

임의의 $a,b\in X$에 대해 다음 세 조건은 동치다.

$$
a\sim b
\quad\Longleftrightarrow\quad
[a]=[b]
\quad\Longleftrightarrow\quad
[a]\cap[b]\ne\varnothing.
$$

**증명.**

먼저 $a\sim b$라고 하자. $x\in[a]$이면 $x\sim a$이고, 추이성에 의해 $x\sim b$이므로 $x\in[b]$이다. 따라서 $[a]\subseteq[b]$이다. 대칭성으로 $b\sim a$이므로 같은 논리를 반대로 적용하면 $[b]\subseteq[a]$이고, 결국 $[a]=[b]$이다.

반대로 $[a]=[b]$라면 $a\in[a]=[b]$이므로 $a\sim b$이다.

또한 $[a]=[b]$이면 $a\in[a]$이므로 교집합은 공집합이 아니다. 마지막으로 $x\in[a]\cap[b]$라면 $x\sim a$, $x\sim b$이다. 대칭성과 추이성으로 $a\sim x\sim b$이므로 $a\sim b$이다. 따라서 세 조건은 서로 동치다.

특히 서로 다른 두 동치류는 공통 원소를 가질 수 없다.

## 3. 분할이란?

집합 $X$의 **분할(partition)**은 $X$를 겹치지 않는 비어 있지 않은 부분집합들로 빠짐없이 나눈 것이다. 부분집합들의 모임 $\mathcal P$가 다음을 만족해야 한다.

1. 모든 $B\in\mathcal P$에 대해 $B\ne\varnothing$.
2. 서로 다른 $B,C\in\mathcal P$에 대해 $B\cap C=\varnothing$.
3. 모든 조각의 합집합이 $X$: $\bigcup_{B\in\mathcal P}B=X$.

각 부분집합을 분할의 **블록(block)**이라고 한다. 즉 $X$의 모든 원소는 정확히 하나의 블록에 속한다.

예를 들어 $X=\{1,2,3,4,5\}$에 대해

$$
\mathcal P=\bigl\{\{1,4\},\{2,5\},\{3\}\bigr\}
$$

은 분할이다. 반면 $\{\{1,2\},\{2,3\},\{4,5\}\}$는 원소 2가 두 블록에 들어 있으므로 분할이 아니다.

## 4. 동치관계가 분할을 만든다

**정리.** $X$ 위의 동치관계 $\sim$에 대해 모든 서로 다른 동치류의 모임

$$
X/{\sim}=\{[a]\mid a\in X\}
$$

은 $X$의 분할이다.

**증명.** 분할의 세 조건을 확인한다.

1. 반사성에 의해 $a\in[a]$이므로 모든 동치류는 비어 있지 않다.
2. 두 동치류가 공통 원소를 가지면 앞에서 증명한 성질에 의해 두 동치류는 같다. 따라서 서로 다른 동치류는 서로소다.
3. 모든 $x\in X$에 대해 $x\in[x]$이므로 동치류들의 합집합은 $X$ 전체다.

따라서 동치류들은 $X$의 분할을 이룬다. $\square$

여기서 $X/{\sim}$은 **몫집합(quotient set)**이라고 한다. 몫집합의 원소는 $X$의 원소 하나가 아니라 **동치류라는 집합**이다.

예를 들어

$$
\mathbb Z/3\mathbb Z=\{[0],[1],[2]\}
$$

에서 $[0]$은 정수 0 하나가 아니라 3의 배수 전체의 집합이다.

## 5. 분할도 동치관계를 만든다

이번에는 반대 방향을 보자. $X$의 분할 $\mathcal P$가 주어졌을 때

$$
a\sim b
\quad\Longleftrightarrow\quad
a\text{와 }b\text{가 같은 블록에 속한다}
$$

로 정의한다. 그러면 이 관계는 동치관계다.

- **반사성:** 모든 원소는 자신이 속한 블록 안에 있다.
- **대칭성:** $a,b$가 같은 블록에 있으면 $b,a$도 같은 블록에 있다.
- **추이성:** $a,b$가 한 블록에 있고 $b,c$가 한 블록에 있으면, $b$를 포함하는 블록은 유일하므로 세 원소는 모두 같은 블록에 있다.

이렇게 만든 관계에서 각 원소의 동치류는 그 원소가 속한 블록과 정확히 같다. 따라서 동치관계에서 분할을 만들고 다시 관계를 복원하거나, 분할에서 관계를 만들고 동치류를 취하면 원래 것으로 돌아온다.

$$
\boxed{\text{집합 }X\text{ 위의 동치관계}
\quad\longleftrightarrow\quad
\text{집합 }X\text{의 분할}}
$$

> 동치관계는 **두 원소를 언제 같은 것으로 볼지** 말해 준다. 분할은 그 기준으로 **원소들이 어떻게 묶이는지** 보여 준다.

## 6. 선형대수: 핵과 몫공간

벡터공간 $V$의 부분공간 $W$에 대해 다음 관계를 정의하자.

$$
u\sim v \quad\Longleftrightarrow\quad u-v\in W.
$$

$0\in W$이므로 반사성이 성립한다. $u-v\in W$이면 $v-u=-(u-v)\in W$이므로 대칭성이 성립한다. 또한 $u-v,v-w\in W$이면 $u-w=(u-v)+(v-w)\in W$이므로 추이성도 성립한다.

따라서 동치류는

$$
[v]=v+W=\{v+w\mid w\in W\}
$$

이다. 이 동치류들의 집합은 **몫공간** $V/W$를 이룬다. $v$에서 $W$ 방향으로 움직여 얻는 벡터들을 하나의 대상으로 묶는다고 생각할 수 있다.

예를 들어 $V=\mathbb R^2$, $W=\{(t,0)\mid t\in\mathbb R\}$이면

$$
[(a,b)]=(a,b)+W=\{(a+t,b)\mid t\in\mathbb R\}.
$$

같은 높이의 점이 하나의 동치류를 이룬다. $\mathbb R^2$는 서로 겹치지 않는 수평선들로 분할된다.

선형사상 $T:V\to U$에 대해서는

$$
T(u)=T(v)
\quad\Longleftrightarrow\quad
T(u-v)=0
\quad\Longleftrightarrow\quad
u-v\in\ker T.
$$

즉 같은 출력으로 가는 벡터들은 $\ker T$에 대한 하나의 동치류를 이룬다. $T$가 구별하지 못하는 차이를 묶으면, 유도된 선형사상 $V/\ker T\to\operatorname{im}T$, $[v]\mapsto T(v)$는 잘 정의된 선형 동형이다. 이것이 선형대수에서의 **제1동형정리**다.

## 7. 군론: 잉여류와 몫군

군 $G$의 부분군 $H$에 대해

$$
a\sim b \quad\Longleftrightarrow\quad a^{-1}b\in H
$$

로 정의하면 동치관계다. 이때 $a$의 동치류는 왼쪽 잉여류

$$
aH=\{ah\mid h\in H\}
$$

와 같다. 따라서 서로 다른 왼쪽 잉여류는 $G$를 분할한다.

다만 **잉여류들의 집합이 언제나 자연스럽게 군이 되는 것은 아니다.** $H$가 정규부분군일 때에만 대표원 선택과 무관하게 $(aH)(bH)=abH$로 연산을 정의할 수 있고, 이때 몫군 $G/H$를 얻는다.

정수의 경우 $\mathbb Z$는 덧셈군이고 $n\mathbb Z$는 정규부분군이므로, 앞의 $\mathbb Z/n\mathbb Z$는 몫집합이면서 덧셈에 관한 몫군이기도 하다.

## 8. 연습문제

**Q1.** $\mathbb Z$에서 $a\sim b\Longleftrightarrow 4\mid(a-b)$로 정의한다. 서로 다른 동치류를 모두 쓰고 $[-3]$을 그중 하나로 표현하라.

<details markdown="1">
<summary><strong>Q1 정답과 해설</strong></summary>

서로 다른 동치류는 $[0],[1],[2],[3]$이다. $-3-1=-4$는 4의 배수이므로

$$
[-3]=[1]=\{\ldots,-7,-3,1,5,\ldots\}.
$$

</details>

**Q2.** $\mathbb R$에서 $x\sim y\Longleftrightarrow x^2=y^2$로 정의한다. 동치관계임을 확인하고 $[2]$, $[0]$을 구하라.

<details markdown="1">
<summary><strong>Q2 정답과 해설</strong></summary>

제곱값의 같음은 반사성, 대칭성, 추이성을 모두 만족하므로 동치관계다. $x^2=4$의 해는 $x=\pm2$이고 $x^2=0$의 해는 $x=0$뿐이므로

$$
[2]=\{-2,2\},\qquad [0]=\{0\}.
$$

</details>

**Q3.** $\mathbb R$에서 $x\sim y\Longleftrightarrow \lvert x-y\rvert\lt 1$로 정의한다. 동치관계인지 판별하라.

<details markdown="1">
<summary><strong>Q3 정답과 해설</strong></summary>

동치관계가 아니다. 다음과 같이 추이성이 성립하지 않는 반례를 찾을 수 있다.

$$
0\sim 0.5,\qquad 0.5\sim 1,\qquad 0\not\sim 1.
$$

처음 두 쌍은 차의 절댓값이 $0.5$이지만, 마지막 쌍은 $\lvert 0-1\rvert=1$이므로 $\lvert x-y\rvert\lt 1$을 만족하지 않는다.

</details>

**Q4.** $T:\mathbb R^2\to\mathbb R$, $T(x,y)=x+y$에 대해 $\ker T$와 $(1,2)$의 동치류 $(1,2)+\ker T$를 구하라.

<details markdown="1">
<summary><strong>Q4 정답과 해설</strong></summary>

$T(x,y)=0$이면 $x+y=0$이므로

$$
\ker T=\{(t,-t)\mid t\in\mathbb R\}.
$$

따라서 동치류는

$$
[(1,2)]=(1,2)+\ker T
=\{(1+t,2-t)\mid t\in\mathbb R\}.
$$

$x=1+t$로 놓으면 두 번째 좌표가 $3-x$이므로, 같은 집합을 다음과 같이 쓸 수 있다.

$$
[(1,2)]=\{(x,3-x)\mid x\in\mathbb R\}.
$$

즉 $x+y=3$인 직선 전체다.

</details>

## 참고 자료

- [University of British Columbia, Equivalence relations and equivalence classes](https://personal.math.ubc.ca/~PLP/book/ch_relations-5.html)
- [University of Alberta, Equivalence classes, partitions, and quotients](https://sites.ualberta.ca/~jsylvest/books/EF/section-equiv-rel-classes.html)
