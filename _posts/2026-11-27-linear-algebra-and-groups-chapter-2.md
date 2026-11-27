---
layout: post
title: "선형대수와 군 2장 - 벡터 공간 (Vector Spaces)"
date: 2026-11-27 23:30:00 +0900
description: "벡터 공간의 공리, 부분공간, 다양한 벡터 공간의 예시와 동형사상"
tags: [math, linear-algebra]
categories: [mathematics]
toc:
  sidebar: left
---

# 2. 벡터 공간 (Vector Spaces)

선형대수학의 대상은 단순히 숫자를 나열한 화살표나 행렬이 아니다. **덧셈과 스칼라 곱셈이라는 두 연산을 갖는 추상적인 공간**이 선형대수학의 핵심이다.

다항식, 함수, 행렬, 수열은 겉모습은 다르지만 동일한 대수적 법칙을 만족할 수 있다. 이 공통 구조를 정의하고, 그 안의 작은 공간을 찾고, 서로 다른 공간이 본질적으로 같은지를 판별하는 것이 이 장의 목표다.

이 글은 이인석 저 『선형대수와 군』 제2장의 목차를 따라 작성한 독립적인 학습 노트이다.

---

## 2.1. Vector Space

### 2.1.1. Field (체)

벡터를 더하는 것뿐 아니라 벡터에 곱하는 스칼라가 어떤 집합에 속하는지도 정해야 한다. 스칼라의 집합 $$F$$는 체(field)라고 가정한다.

체는 덧셈, 뺄셈, 곱셈, 그리고 0이 아닌 원소로의 나눗셈이 가능한 집합으로, 교환법칙과 결합법칙, 분배법칙 및 항등원과 역원의 공리를 만족한다.

대표적으로

$$
\mathbb Q,\quad \mathbb R,\quad \mathbb C,\quad \mathbb F_p=\mathbb Z/p\mathbb Z \quad (p\text{ prime})
$$

가 체이다. 반면 $$\mathbb Z$$는 2의 곱셈 역원 $$1/2$$가 없으므로 체가 아니다.

### 2.1.2. Definition of a vector space

체 $$F$$ 위의 벡터 공간 $$V$$는 두 연산

$$
+:V\times V\longrightarrow V,\qquad
\cdot:F\times V\longrightarrow V
$$

을 갖는 집합으로, 모든 $$u,v,w\in V$$와 $$a,b\in F$$에 대해 다음 공리를 만족한다.

| 구분 | 공리 |
| :--- | :--- |
| 덧셈의 교환법칙 | $$u+v=v+u$$ |
| 덧셈의 결합법칙 | $$(u+v)+w=u+(v+w)$$ |
| 덧셈의 항등원 | $$\exists 0_V\in V:\ v+0_V=v$$ |
| 덧셈의 역원 | $$\forall v\in V,\ \exists -v\in V:\ v+(-v)=0_V$$ |
| 벡터 덧셈에 대한 분배법칙 | $$a(u+v)=au+av$$ |
| 스칼라 덧셈에 대한 분배법칙 | $$(a+b)v=av+bv$$ |
| 스칼라 곱셈의 결합법칙 | $$a(bv)=(ab)v$$ |
| 스칼라 곱셈의 항등원 | $$1_Fv=v$$ |

덧셈과 스칼라 곱셈의 닫힘성은 이미 두 연산의 공역이 $$V$$라는 정의에 포함되어 있다. 따라서 $$(V,+)$$는 아벨 군(abelian group)이며, 스칼라 곱셈은 그 구조와 양립해야 한다.

> **핵심:** 벡터인지 아닌지는 원소가 어떻게 생겼는지가 아니라, 어떤 연산이 정의되어 있고 그 연산이 어떤 법칙을 만족하는지에 의해 결정된다.

### 2.1.3. 공리로부터 유도되는 성질

공리와 정리를 구분하는 것이 중요하다. 다음 성질은 별도로 가정하지 않아도 공리로부터 증명된다.

- 영벡터와 각 벡터의 덧셈 역원은 유일하다.
- $$0_Fv=0_V$$ 및 $$a0_V=0_V$$.
- $$(-1_F)v=-v$$.
- $$av=0_V\Longrightarrow a=0_F\text{ or }v=0_V$$.

예를 들어 영벡터의 유일성은 두 항등원 $$e,e'$$가 있다고 가정하면 $$e=e+e'=e'$$이므로 성립한다. 역원도 두 후보를 각각 $$w,w'$$라 하면 $$w=w+(v+w')=(w+v)+w'=w'$$이다.

**Proof: 스칼라 0을 곱하면 왜 영벡터가 되는가?**

$$
0_Fv=(0_F+0_F)v=0_Fv+0_Fv.
$$

양변에 $$0_Fv$$의 덧셈 역원을 더하면

$$
0_Fv=0_V.
$$

마찬가지로 $$a0_V=a(0_V+0_V)=a0_V+a0_V$$이므로 $$a0_V=0_V$$이다. 또한

$$
v+(-1_F)v=(1_F-1_F)v=0_V
$$

이므로 역원의 유일성에 따라 $$(-1_F)v=-v$$이다.

마지막으로 $$a\ne 0_F$$이면 체의 성질에 따라 $$a^{-1}$$이 존재한다. 따라서

$$
av=0_V\ \Longrightarrow\
v=a^{-1}(av)=a^{-1}0_V=0_V.
$$

여기서 체의 역원이 필요하다는 점에 주목하자.

### 2.1.4. 스칼라 체가 달라지면 공간도 달라진다

$$\mathbb C$$는 자기 자신 위의 벡터 공간인 동시에 $$\mathbb R$$ 위의 벡터 공간이다.

실수 스칼라를 사용하면 모든 복소수는 $$a+bi$$라는 두 실수의 정보로 표현된다. 복소수 스칼라를 사용하면 $$z=z\cdot 1$$이라는 하나의 복소수로 표현된다. 다음 장의 차원 개념으로 쓰면

$$
\dim_{\mathbb R}\mathbb C=2,\qquad
\dim_{\mathbb C}\mathbb C=1.
$$

즉 벡터 공간의 구조를 이야기할 때는 스칼라 체를 명시해야 한다.

---

## 2.2. Subspace (부분공간)

### 2.2.1. Definition and subspace criterion

$$V$$가 체 $$F$$ 위의 벡터 공간일 때, 부분집합 $$W\subseteq V$$가 기존의 연산을 그대로 사용하여 벡터 공간을 이루면 $$W$$를 $$V$$의 부분공간(subspace)이라 한다.

**정리.** 다음 세 조건은 부분공간이 되기 위한 필요충분조건이다.

1. $$0_V\in W$$.
2. $$u,v\in W\Longrightarrow u+v\in W$$.
3. $$a\in F,\ u\in W\Longrightarrow au\in W$$.

동치인 간결한 판정법은

$$
\boxed{
W\ne\varnothing,\qquad
\forall u,v\in W,\ \forall a,b\in F,\quad au+bv\in W.
}
$$

**Proof.** 부분공간이라면 위 조건은 벡터 공간 공리에서 바로 나온다. 반대로 $$W$$가 공집합이 아니고 위 선형결합 조건을 만족하면, $$w\in W$$에 대해 $$0_Fw+0_Fw=0_V\in W$$이다. 계수를 각각 1과 1, 그리고 임의의 스칼라와 0으로 선택하면 덧셈 및 스칼라 곱셈의 닫힘성을 얻는다. $$-w=(-1_F)w\in W$$이며 나머지 공리는 $$V$$로부터 그대로 상속된다. 따라서 $$W$$는 부분공간이다.

### 2.2.2. 기하학적 예시와 반례

$$\mathbb R^2$$에서 원점을 지나는 직선 $$W=\{(t,2t):t\in\mathbb R\}$$는 부분공간이다.

$$
a(t,2t)+b(s,2s)=(at+bs,2(at+bs))\in W.
$$

반면 $$y=2x+1$$은 영벡터를 포함하지 않으므로 부분공간이 아니다. 원점을 지나더라도 단위원판은 스칼라 곱셈에 닫혀 있지 않으므로 부분공간이 아니다.

<figure style="margin: 1.5rem auto; max-width: 620px;">
<svg viewBox="0 0 600 250" role="img" aria-label="원점을 지나는 직선과 원점을 지나지 않는 직선의 비교" style="width:100%;height:auto;border:1px solid var(--global-divider-color,#888);border-radius:8px;">
  <g stroke="currentColor" opacity=".5" stroke-width="1">
    <path d="M25 125H275 M150 20V230 M325 125H575 M450 20V230" fill="none"/>
  </g>
  <path d="M100 225L200 25" stroke="#1686b8" stroke-width="3"/>
  <path d="M382 225L482 25" stroke="#d97706" stroke-width="3"/>
  <g fill="currentColor" font-size="12"><text x="263" y="142">x</text><text x="159" y="30">y</text><text x="560" y="142">x</text><text x="459" y="30">y</text><text x="157" y="140">0</text><text x="457" y="140">0</text></g>
  <circle cx="150" cy="125" r="4" fill="#1686b8"/><circle cx="450" cy="125" r="4" fill="currentColor"/>
  <g font-size="14" fill="currentColor" text-anchor="middle"><text x="150" y="245">y = 2x : subspace</text><text x="450" y="245">y = 2x + 1 : not a subspace</text></g>
</svg>
<figcaption>원점을 지나는 직선과 평행이동된 직선. 두 번째 직선은 영벡터를 포함하지 않는다.</figcaption>
</figure>

$$\mathbb R^3$$에서 $$x+y+z=0$$으로 정의된 평면도 부분공간이다. 이처럼 동차 선형방정식으로 정의된 해집합은 부분공간을 이룬다.

### 2.2.3. Intersection, union and sum

두 부분공간 $$U,W\subseteq V$$에 대해 교집합 $$U\cap W$$는 항상 부분공간이다. 더 일반적으로 임의의 부분공간들의 교집합도 부분공간이다.

그러나 합집합 $$U\cup W$$는 일반적으로 부분공간이 아니다. 예를 들어 $$\mathbb R^2$$의 두 좌표축은 각각 부분공간이지만, $$(1,0)+(0,1)=(1,1)$$은 두 축의 합집합에 속하지 않는다.

실제로 $$U\cup W$$가 부분공간일 필요충분조건은 $$U\subseteq W$$ 또는 $$W\subseteq U$$이다. 서로 포함되지 않으면 $$u\in U\setminus W$$, $$w\in W\setminus U$$를 고를 수 있다. $$u+w$$가 어느 한쪽에 속한다고 가정하면 뺄셈의 닫힘성에 의해 모순이 생긴다.

대신 다음의 합(sum)은 항상 부분공간이다.

$$
U+W=\{u+w:u\in U,\ w\in W\}.
$$

이는 $$U,W$$를 모두 포함하는 가장 작은 부분공간이다. 실제로 임의의 $$a,b\in F$$에 대하여

$$
a(u_1+w_1)+b(u_2+w_2)
=(au_1+bu_2)+(aw_1+bw_2)\in U+W.
$$

두 부분공간을 포함하는 모든 부분공간은 이들의 모든 합도 포함해야 하므로 최소성이 성립한다.

---

## 2.3. Vector Space의 보기 (Examples)

### 2.3.1. Coordinate space

가장 친숙한 예시는

$$
F^n=\{(x_1,\ldots,x_n):x_i\in F\}
$$

이다. 덧셈과 스칼라 곱셈은 성분별로 정의한다.

$$
(x_1,\ldots,x_n)+(y_1,\ldots,y_n)
=(x_1+y_1,\ldots,x_n+y_n),
$$

$$
a(x_1,\ldots,x_n)=(ax_1,\ldots,ax_n).
$$

이 연산으로 벡터 공간 공리는 체의 공리로부터 성분별로 성립한다.

### 2.3.2. Matrix space

$$m\times n$$ 행렬 전체의 집합 $$M_{m\times n}(F)$$ 역시 성분별 덧셈과 스칼라 곱셈으로 벡터 공간을 이룬다. 영벡터는 영행렬이다.

정사각행렬 중 대칭행렬의 집합

$$
S_n(F)=\{A\in M_{n\times n}(F):A^T=A\}
$$

은 부분공간이다. 전치의 선형성으로

$$
(aA+bB)^T=aA^T+bB^T=aA+bB
$$

가 성립하기 때문이다.

반면 가역행렬 전체 $$GL_n(F)$$는 영행렬을 포함하지 않으므로 벡터 공간이 아니다. 행렬 곱셈에 대해서는 군이 되며, 이 차이는 이후 군을 공부할 때 중요하다.

### 2.3.3. Polynomial space

$$F[x]$$는 계수가 $$F$$에 속하는 모든 다항식의 공간이다.

$$
P_n(F)=\left\{\sum_{k=0}^{n}a_kx^k:a_k\in F\right\}
$$

은 차수가 $$n$$ 이하인 다항식의 부분공간이다. 영다항식도 포함한다.

예를 들어

$$
2(1+x)-3(x^2-x)=2+5x-3x^2
$$

이므로 두 다항식의 선형결합은 여전히 같은 공간에 속한다.

주의할 점은 **차수가 정확히 $$n$$인 다항식들의 집합은 부분공간이 아니라는 것**이다. 영다항식을 포함하지 않으며 최고차항이 상쇄될 수도 있다.

### 2.3.4. Function space and sequence space

임의의 집합 $$X$$에 대해 함수 전체의 집합

$$
F^X=\{f:X\longrightarrow F\}
$$

은 점별(pointwise) 연산에 의해 벡터 공간을 이룬다.

$$
(f+g)(x)=f(x)+g(x),\qquad
(af)(x)=af(x).
$$

특히 실수값 연속함수 공간 $$C([0,1],\mathbb R)$$, 미분 가능한 함수 공간 $$C^1([0,1],\mathbb R)$$, 실수 수열 공간 $$\mathbb R^{\mathbb N}$$ 모두 벡터 공간이다.

연속함수 전체 공간은 다항식 공간과 달리 일반적으로 유한 개의 벡터로 모든 원소를 표현할 수 없다. 이처럼 벡터 공간은 반드시 유한 차원일 필요가 없다.

### 2.3.5. Solution space of linear equations

행렬 $$A\in M_{m\times n}(F)$$에 대해 동차 선형방정식의 해집합

$$
W=\{x\in F^n:Ax=0\}
$$

은 부분공간이다. 영벡터를 포함하며, $$Ax=Ay=0$$이면

$$
A(ax+by)=aAx+bAy=0.
$$

반면 $$Ax=b$$에서 $$b\ne 0$$이면 해집합은 영벡터를 포함하지 않는다. 해가 존재하고 하나의 특수해를 $$x_p$$라고 하면 해집합은

$$
x_p+\{x:Ax=0\}
$$

으로 표현되는 affine space이다.

### 2.3.6. Application: ODE와 신경 동역학

함수 공간의 관점에서 미분방정식도 선형대수학의 문제가 된다. 예를 들어 동차 선형 ODE

$$
y''+y=0
$$

의 해집합은

$$
\{a\cos t+b\sin t:a,b\in\mathbb R\}
$$

이며 $$C^2(\mathbb R,\mathbb R)$$의 부분공간이다. 미분 연산자 $$L[y]=y''+y$$가 선형이므로 두 해의 선형결합도 해가 된다. 이것이 중첩 원리(superposition principle)의 대수적 근거이다.

예를 들어 선형화된 신경 동역학 $$\dot{x}=Ax$$에서도 해의 선형결합이 다시 해가 된다. 반면 일반적인 비선형 발화 동역학에서는 이러한 중첩 원리가 보장되지 않는다.

---

## 2.4. Isomorphism (동형사상)

### 2.4.1. 구조가 같다는 것의 의미

집합이 같다는 것과 대수적 구조가 같다는 것은 다르다. 예를 들어 $$\mathbb R^3$$의 원소는 숫자 세 개로 이루어진 튜플이고, $$P_2(\mathbb R)$$의 원소는 다항식이다. 두 집합은 서로 다르지만 벡터 공간으로서 동일한 구조를 갖는다.

체 $$F$$ 위의 두 벡터 공간 $$V,W$$에 대하여 사상 $$T:V\longrightarrow W$$가 다음 조건을 만족하면 동형사상(isomorphism)이라 한다.

1. $$T$$는 전단사(bijection)이다.
2. $$T(u+v)=T(u)+T(v)$$.
3. $$T(av)=aT(v)$$.

두 번째와 세 번째 조건은 다음 하나의 선형성 조건과 동치이다.

$$
T(au+bv)=aT(u)+bT(v).
$$

이러한 사상이 존재하면 $$V\cong W$$라고 표기한다. 동형사상은 정보 손실 없이 두 공간의 연산 구조를 보존한다.

### 2.4.2. Example: polynomial space and coordinate space

다음 사상을 생각하자.

$$
\begin{aligned}
T:P_2(\mathbb R)&\longrightarrow\mathbb R^3,\\
a+bx+cx^2&\longmapsto(a,b,c).
\end{aligned}
$$

- **단사:** 계수 세 개가 같다면 같은 다항식이다.
- **전사:** 임의의 $$(a,b,c)\in\mathbb R^3$$에 대응하는 다항식 $$a+bx+cx^2$$가 존재한다.
- **선형성:** 다항식의 덧셈과 스칼라 곱셈은 계수별로 이루어진다.

따라서 $$P_2(\mathbb R)\cong\mathbb R^3$$이다.

<figure style="margin:1.5rem auto;max-width:650px;">
<svg viewBox="0 0 600 160" role="img" aria-label="다항식과 계수 벡터 사이의 동형사상" style="width:100%;height:auto;">
  <rect x="15" y="20" width="230" height="120" rx="9" fill="#1686b8" fill-opacity=".12" stroke="#1686b8"/>
  <rect x="355" y="20" width="230" height="120" rx="9" fill="#1686b8" fill-opacity=".12" stroke="#1686b8"/>
  <g fill="currentColor" font-size="16" text-anchor="middle"><text x="130" y="48">P₂(ℝ)</text><text x="470" y="48">ℝ³</text><text x="130" y="85">a + bx + cx²</text><text x="470" y="85">(a, b, c)</text><text x="130" y="113">2 − x + 3x²</text><text x="470" y="113">(2, −1, 3)</text><text x="300" y="60">T</text><text x="300" y="127">T⁻¹</text></g>
  <g stroke="currentColor" stroke-width="1.7" fill="none"><path d="M250 72H350l-8 -5m8 5l-8 5"/><path d="M350 100H250l8 -5m-8 5l8 5"/></g>
</svg>
<figcaption>다항식을 계수 벡터로 바꾸고 다시 복원할 수 있다. 두 연산도 보존된다.</figcaption>
</figure>

일반적으로 $$P_n(F)\cong F^{n+1}$$이며, 행렬을 일정한 순서로 펼치면 $$M_{m\times n}(F)\cong F^{mn}$$이다.

### 2.4.3. 동형사상의 기본 성질

동형사상 $$T:V\to W$$는 영벡터를 영벡터로 보낸다.

$$
T(0_V)=T(0_Fv)=0_FT(v)=0_W.
$$

또한 $$T(-v)=-T(v)$$이다.

**정리.** 동형사상의 역함수 $$T^{-1}:W\to V$$ 역시 동형사상이다.

**Proof.** $$x,y\in W$$에 대해 $$u=T^{-1}(x),v=T^{-1}(y)$$라 하자. 그러면

$$
T(au+bv)=ax+by.
$$

양변에 역함수를 적용하면

$$
T^{-1}(ax+by)=aT^{-1}(x)+bT^{-1}(y).
$$

역함수는 전단사이고 선형이므로 동형사상이다.

항등사상은 동형사상이며 동형사상의 합성도 동형사상이다. 따라서 동형이라는 관계는 반사성, 대칭성, 추이성을 만족하는 동치관계(equivalence relation)이다. 제1장의 동치관계가 추상적인 대수 구조의 분류에 직접 사용되는 것이다.

### 2.4.4. 단순한 전단사와의 차이

$$T:\mathbb R\to\mathbb R$$, $$T(x)=x+1$$은 전단사이지만 $$T(0)=1\ne 0$$이므로 동형사상이 아니다.

반대로 $$T(x)=2x$$는 실수 위에서 전단사이며 선형이므로 동형사상이다. 길이를 두 배로 만들지만 여전히 벡터 공간의 구조는 보존한다.

즉, 벡터 공간 동형은 길이나 각도까지 보존한다는 의미가 아니다. 그러한 조건은 내적 공간에서 추가로 다루게 된다.

### 2.4.5. 다음 장과 연결: 기저와 차원

다음 장에서 증명할 중요한 결과는 같은 체 위의 두 유한 차원 벡터 공간에 대하여

$$
V\cong W\quad\Longleftrightarrow\quad\dim_F V=\dim_F W
$$

라는 것이다. 모든 $$n$$차원 벡터 공간은 기저를 선택하면 $$F^n$$과 동형이다.

이는 행렬 계산을 넘어 벡터 공간을 **동형까지 분류(classification up to isomorphism)** 할 수 있음을 뜻한다.

---

## Summary

| 개념 | 핵심 |
| :--- | :--- |
| Field | 스칼라가 속하는 대수적 구조 |
| Vector Space | 아벨 군과 그 구조에 양립하는 스칼라 곱셈 |
| Subspace | 원래 연산을 상속하며 선형결합에 닫힌 부분집합 |
| Isomorphism | 선형성과 전단사성을 모두 만족하는 사상 |

벡터 공간은 원소의 모양을 추상화하고, 부분공간은 그 구조를 유지하는 내부 집합을 찾으며, 동형사상은 서로 다른 공간의 본질적 동일성을 판별한다.

---

## Exercises

<details markdown="1">
<summary><strong>1. 공리로부터 소거법칙 증명하기</strong></summary>

$$u+w=v+w$$이면 $$u=v$$임을 증명하라.

**Solution.** 양변에 $$-w$$를 더하고 결합법칙 및 항등원 공리를 적용하면 $$u+(w-w)=v+(w-w)$$이므로 $$u=v$$이다.

</details>

<details markdown="1">
<summary><strong>2. 부분공간 판별</strong></summary>

$$W=\{(x,y,z)\in\mathbb R^3:x+2y-z=0\}$$가 부분공간임을 증명하라.

**Solution.** 영벡터를 포함하고, 두 원소의 선형결합에 대해 좌변을 계산하면 각 원소의 좌변을 같은 계수로 선형결합한 값인 0이 된다. 따라서 부분공간이다.

</details>

<details markdown="1">
<summary><strong>3. 다항식 공간의 부분공간</strong></summary>

$$W=\{p\in P_3(\mathbb R):p(1)=0\}$$가 부분공간인지 판별하고 간단한 형태로 표현하라.

**Solution.** $$(ap+bq)(1)=ap(1)+bq(1)=0$$이고 영다항식을 포함한다. 인수정리에 의해 $$W=\{(x-1)q(x):q\in P_2(\mathbb R)\}$$이다.

</details>

<details markdown="1">
<summary><strong>4. 동형사상 직접 구성하기</strong></summary>

$$\mathbb R^2$$와 $$W=\{(x,y,z)\in\mathbb R^3:x+y+z=0\}$$ 사이의 동형사상을 구성하라.

**Solution.** $$T(a,b)=(a,b,-a-b)$$라고 하면 선형이고, $$T^{-1}(x,y,z)=(x,y)$$가 존재한다. 따라서 동형사상이다.

</details>

---

## Reference

- 이인석, 『선형대수와 군』 (개정판), 서울대학교출판문화원, 제2장 벡터공간. [출판사 도서 정보 및 목차](https://uni.snupress.com/book/category?goodsidx=290&md=view).
- 이 글의 정의, 증명, 예제 및 그림은 공개 목차에 맞춰 독립적으로 구성한 학습용 설명이며, 교재 본문이나 연습문제를 그대로 옮긴 것이 아니다.
