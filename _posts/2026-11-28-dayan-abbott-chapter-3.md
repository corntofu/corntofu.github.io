---
layout: post
math: true
title: "Dayan & Abbott Chapter 3 — Neural Decoding"
date: 2026-11-28 16:38:00 +0900
description: "Neural encoding의 역문제: Bayesian decoding, signal detection(d′·ROC·AUC), population vector, Poisson MLE, Fisher information·Cramér–Rao bound, spike-train reconstruction을 수식과 직관으로 정리한다."
tags: computational-neuroscience
categories: Computational Neuroscience
---

*Peter Dayan & L. F. Abbott, Theoretical Neuroscience*, Chapter 3: **Neural Decoding** (pp. 87–122) 학습 노트.

> **이번 장의 질문:** 뉴런의 반응을 기록했을 때 **어떤 자극이 들어왔는지**, 또는 자극의 방향·세기·시간적 변화를 얼마나 정확하게 복원할 수 있을까?

Chapter 1에서는 spike train을 통계적으로 표현했고, Chapter 2에서는 stimulus로부터 firing rate를 예측했다. Chapter 3은 **역방향 추론**을 다룬다.

$$
\boxed{
\underbrace{s}_{\text{stimulus}}
\xrightarrow[\text{Ch. 1–2}]{\text{encoding}}
\underbrace{\boldsymbol r,\rho(t)}_{\text{neural response}}
\xrightarrow[\text{Ch. 3}]{\text{decoding}}
\underbrace{\hat s}_{\text{stimulus estimate}}
}
$$

이 장에서 추정 대상은 정적인 자극 변수 $s$일 수도 있고, 시간에 따라 변하는 전체 자극 $s(t)$일 수도 있다. 크게 다음의 네 절로 구성된다.

| 원문 절 | 주요 내용 | 핵심 도구 |
| --- | --- | --- |
| 3.1 Encoding and Decoding | 조건부 확률을 뒤집기 | Bayes' theorem |
| 3.2 Discrimination | 두 자극을 구별하기 | $d'$, ROC, likelihood-ratio test |
| 3.3 Population Decoding | 여러 뉴런의 정보를 결합하기 | population vector, ML, MAP, Fisher information |
| 3.4 Spike Train Decoding | 시간에 따라 변하는 자극을 복원하기 | reconstruction kernel, Wiener–Hopf, Fourier |

---

## 1. Encoding에서 Decoding으로 (3.1)

### 1.1 우리가 아는 확률과 알고 싶은 확률

Encoding model은 자극 $s$가 주어졌을 때 뉴런 반응 $\boldsymbol r$가 관측될 확률을 설명한다.

$$
\boxed{p(\boldsymbol r\mid s)}
$$

Decoding에서는 반응 $\boldsymbol r$를 관측한 상태에서 원래 자극에 대한 확률을 구하고 싶다.

$$
\boxed{p(s\mid\boldsymbol r)}
$$

그 관계는 Bayes' theorem이다.

$$
\boxed{
p(s\mid\boldsymbol r)
=
\frac{p(\boldsymbol r\mid s)p(s)}
{p(\boldsymbol r)}
}
\tag{3.3}
$$

| 항 | 의미 |
| --- | --- |
| $p(\boldsymbol r\mid s)$ | **Likelihood**: 이 자극이 주어졌을 때 관측한 반응이 얼마나 그럴듯한가 |
| $p(s)$ | **Prior**: 뉴런 반응을 보기 전 자극이 등장할 가능성 |
| $p(s\mid\boldsymbol r)$ | **Posterior**: 관측한 신경 반응을 고려한 자극의 분포 |
| $p(\boldsymbol r)$ | **Evidence**: 가능한 모든 자극을 종합한 반응의 주변확률 |

연속적인 stimulus라면 분모는

$$
p(\boldsymbol r)
=
\int p(\boldsymbol r\mid s)p(s)\,ds
$$

로 계산한다. 여기서 $p$는 변수가 연속이면 확률**밀도**이고 이산이면 확률질량함수로 이해한다.

**중요:** Likelihood가 높아도 prior가 매우 작으면 posterior가 크지 않을 수 있다. Decoding은 encoding model만 뒤집으면 끝나는 작업이 아니다.

### 1.2 작은 예제: spike count만 보고 A/B 구별하기

1초 동안 자극 A를 제시하면 평균 5회, B를 제시하면 평균 15회 발화한다고 하자. 독립적인 Poisson spike-count model을 쓰면

$$
N\mid A\sim\operatorname{Poisson}(5),
\qquad
N\mid B\sim\operatorname{Poisson}(15).
$$

실제로 $N=12$개를 관측했다면 likelihood ratio는

$$
\begin{aligned}
\frac{P(N=12\mid B)}{P(N=12\mid A)}
&=\frac{15^{12}e^{-15}/12!}{5^{12}e^{-5}/12!}\\
&=3^{12}e^{-10}\approx24.1.
\end{aligned}
$$

두 자극의 prior가 같다면

$$
P(B\mid N=12)
=\frac{24.1}{1+24.1}
\approx0.960.
$$

관측한 spike 수 12개는 B를 더 지지하지만, 이것은 **확정 판정**이 아니라 prior와 noise model에 의존하는 확률적 추론이다.

---

## 2. 두 자극을 구분하는 성능: Discrimination (3.2)

### 2.1 Random-dot motion 실험

원문은 원숭이가 점들의 운동 방향을 판단하는 고전적인 random-dot motion task를 소개한다. 움직이는 점들의 일부만 같은 방향으로 이동하도록 하며 그 비율인 **coherence**를 조절한다.

- Coherence가 **작다** → 움직임 방향을 구분하기 어렵다.
- Coherence가 **크다** → 움직임 방향을 구분하기 쉽다.
- MT 영역 뉴런은 자신의 **preferred direction**과 반대 방향에 대해 서로 다른 firing-rate 분포를 나타낼 수 있다.

따라서 뉴런 하나의 반응만으로도 판별을 수행할 수 있는지 알아볼 수 있다.

### 2.2 두 분포 사이의 거리 $d'$

선호 방향(+)과 반대 방향(−)의 반응이 **동일 분산**의 Gaussian이라고 가정하자.

$$
r\mid+\sim\mathcal N(\mu_+,\sigma_r^2),
\qquad
r\mid-\sim\mathcal N(\mu_-,\sigma_r^2).
$$

두 반응 분포의 분리 정도를

$$
\boxed{
d'=\frac{\mu_+-\mu_-}{\sigma_r}
}
\tag{3.4}
$$

로 정의한다($\mu_+>\mu_-$ 가정).

**왜 평균 차이를 표준편차로 나눌까?** 평균이 10 Hz 차이 나더라도 trial 간 변동이 1 Hz인 경우와 20 Hz인 경우의 판별 난이도는 전혀 다르다. $d'$는 **평균의 차이를 noise의 크기로 정규화**한 값이다.

### 2.3 Threshold에서 ROC curve로

뉴런의 spike-count firing rate가 $z$ 이상이면 +, 미만이면 −라고 판단하자.

$$
\hat s=
\begin{cases}
+,&r\ge z,\\
-,&r<z.
\end{cases}
$$

Threshold $z$에 따라 두 비율이 변한다.

$$
\mathrm{TPR}(z)=P(r\ge z\mid+),
\qquad
\mathrm{FPR}(z)=P(r\ge z\mid-).
$$

여러 threshold의 점 $(\mathrm{FPR},\mathrm{TPR})$을 연결하면 **ROC curve**가 된다. ROC가 대각선 근처면 판별력이 낮고, 왼쪽 위 모서리에 가까우면 판별력이 높다.

**AUC와 2AFC의 연결**은 특히 중요하다. + 자극의 반응 $r_+$ 하나와 − 자극의 반응 $r_-$ 하나를 독립적으로 뽑아 비교하는 *two-alternative forced choice* 과제에서는

$$
\boxed{
\mathrm{AUC}
=P(r_+>r_-)+\tfrac12P(r_+=r_-)
}
$$

이다. 연속 분포에서는 tie 확률이 0이어서 $\mathrm{AUC}=P(r_+>r_-)$가 된다.

동일 분산 Gaussian이라면 $r_+-r_-$의 분산이 $2\sigma_r^2$이므로

$$
\boxed{
P(\text{correct in 2AFC})
=\Phi\left(\frac{d'}{\sqrt2}\right)
}
$$

이다. $\Phi$는 표준정규분포 CDF다.

| $d'$ | 2AFC 정답 확률 (AUC) |
| --- | --- |
| 0 | 50.0% |
| 1 | 약 76.0% |
| 2 | 약 92.1% |
| 3 | 약 98.3% |

### 2.4 왜 likelihood-ratio test가 더 일반적인가?

Firing-rate threshold는 두 Gaussian 분포를 비교할 때 직관적이지만, 일반적인 분포에서는 최적의 판별 경계가 단순한 $r$의 threshold가 아닐 수 있다.

Likelihood ratio를 사용하면

$$
\boxed{\Lambda(r)=\frac{p(r\mid+)}{p(r\mid-)}}
$$

라고 정의할 수 있다. 양쪽 prior와 오분류 비용이 같을 때는 $\Lambda(r)>1$이면 +로 판단한다. Prior와 비용이 다르면 판정 임계값이 바뀐다.

**핵심:** 좋은 판별기는 단순히 평균 firing rate를 비교하는 것이 아니라 반응이 나타날 **전체 확률분포**를 고려한다.

---

## 3. Population decoding: 여러 뉴런이 함께 투표한다 (3.3)

뉴런 하나의 발화는 불규칙하다. 여러 뉴런의 정보를 조합하면 보다 안정적으로 자극을 추정할 수 있다. Population response를

$$
\boldsymbol r=(r_1,r_2,\ldots,r_M)
$$

로 쓰자. 여기서 $M$은 뉴런 수다.

### 3.1 Population vector

원문은 귀뚜라미 cercal system의 공기 흐름 방향 추정과 운동피질의 방향 선택성을 예제로 다룬다.

뉴런 $a$의 preferred direction을 단위벡터 $\boldsymbol c_a$라 하고, 그 뉴런의 반응을 $r_a$라 하자. 단순한 population vector는

$$
\boxed{
\boldsymbol v_{\mathrm{pop}}
=\sum_{a=1}^{M}w_a r_a\boldsymbol c_a
}
$$

로 만들 수 있다. $w_a$는 뉴런별 firing-rate scale을 정규화하는 가중치다. 예를 들어 $w_a=1/r_{\max,a}$로 선택하면 뉴런별 최대 반응을 기준으로 정규화할 수 있다.

결과 벡터의 방향

$$
\hat\theta=\operatorname{atan2}(v_y,v_x)
$$

를 자극 방향의 추정값으로 사용하는 것이다.

**직관:** 뉴런이 자신이 좋아하는 방향으로 '투표'하고, 강하게 발화할수록 더 큰 표를 행사한다.

하지만 tuning curve가 불균일하거나 뉴런 사이의 noise correlation이 강하면 단순 벡터합은 최적 decoder가 아닐 수 있다.

---

## 4. Poisson population에서 Maximum Likelihood (3.3)

### 4.1 Encoding distribution을 이용해 원래 자극 찾기

뉴런 $a$의 tuning curve를 $f_a(s)$라 하고, 길이 $T$인 trial에서 spike count $n_a$를 관측했다고 하자.

$$
n_a\mid s\sim\operatorname{Poisson}(Tf_a(s)).
$$

자극 $s$가 주어졌을 때 뉴런 사이의 spike count가 조건부 독립이라면

$$
\boxed{
P(\boldsymbol n\mid s)
=\prod_{a=1}^{M}
\frac{[Tf_a(s)]^{n_a}}{n_a!}
e^{-Tf_a(s)}
}.
$$

Decoding에서는 $\boldsymbol n$을 이미 관측했다. 따라서 가장 그럴듯한 $s$를 구하면 된다.

$$
\boxed{
\hat s_{\mathrm{ML}}
=\arg\max_s P(\boldsymbol n\mid s)
}.
$$

### 4.2 Log-likelihood 미분

로그를 취하면

$$
\ell(s)=
\sum_{a=1}^{M}
\left[
n_a\log(Tf_a(s))
-Tf_a(s)-\log(n_a!)
\right].
$$

$t$가 아닌 **자극 변수 $s$**로 미분하면

$$
\boxed{
\ell'(s)
=\sum_{a=1}^{M}
\left[
n_a\frac{f_a'(s)}{f_a(s)}
-Tf_a'(s)
\right]
}.
$$

이를 0으로 놓고 후보해들을 비교하면 maximum likelihood estimate를 찾을 수 있다. 최대점이 경계에 있거나 여러 극값이 존재할 수 있으므로 미분식 $=0$만으로 언제나 해가 정해지는 것은 아니다.

### 4.3 Gaussian tuning curve의 특별한 경우

$$
f_a(s)
=f_{\max,a}\exp\left[-\frac{(s-s_a)^2}{2\sigma_a^2}\right]
$$

이면

$$
\frac{f_a'(s)}{f_a(s)}
=-\frac{s-s_a}{\sigma_a^2}.
$$

뉴런들의 선호 자극이 충분히 조밀하고 균등하게 배치되어 $\sum_a f_a(s)$가 거의 일정하다면 $\sum_a Tf_a'(s)\approx0$이다. 이 **추가 가정** 아래

$$
\boxed{
\hat s_{\mathrm{ML}}
\approx
\frac{\displaystyle\sum_a n_a s_a/\sigma_a^2}
{\displaystyle\sum_a n_a/\sigma_a^2}
}
\tag{3.32}
$$

가 된다. 각 뉴런의 tuning 폭까지 같으면

$$
\boxed{
\hat s_{\mathrm{ML}}
\approx\frac{\sum_a n_a s_a}{\sum_a n_a}
}
\tag{3.33}
$$

이다. 뉴런의 preferred stimulus를 **발화량으로 가중평균**한 것이므로 population vector와 연결되는 직관을 준다.

> 이 간단한 가중평균 공식은 보편적인 MLE 공식이 아니다. 특히 자극의 경계 근처에서 $\sum_a f_a(s)$가 크게 변하면 원래 log-likelihood 전체를 최적화해야 한다.

---

## 5. Bayesian estimation: MLE, MAP, Posterior mean (3.3)

### 5.1 MAP는 MLE와 어떻게 다른가?

Bayesian decoding에서는

$$
p(s\mid\boldsymbol n)
\propto P(\boldsymbol n\mid s)p(s)
$$

라는 posterior 전체를 고려한다.

- **MLE:** $\hat s_{\mathrm{ML}}=\arg\max_s P(\boldsymbol n\mid s)$
- **MAP:** $\hat s_{\mathrm{MAP}}=\arg\max_s P(\boldsymbol n\mid s)p(s)$

Prior가 균일하면 둘은 같지만, 그렇지 않으면 MLE보다 흔한 자극 쪽으로 MAP 추정값이 이동할 수 있다.

### 5.2 제곱오차를 최소화하는 추정량은 무엇인가?

Bayesian decision theory에서는 **어떤 loss를 최소화하느냐**가 중요하다. 관측된 응답 $\boldsymbol n$에서 제곱오차 loss를 사용하는 경우

$$
R(\hat s\mid\boldsymbol n)
=
\int (s-\hat s)^2p(s\mid\boldsymbol n)\,ds
$$

를 최소화해야 한다.

$$
\begin{aligned}
\frac{\partial R}{\partial\hat s}
&=\int 2(\hat s-s)p(s\mid\boldsymbol n)\,ds\\
&=2\left(\hat s-\mathbb E[s\mid\boldsymbol n]\right).
\end{aligned}
$$

따라서

$$
\boxed{\hat s_{\mathrm{Bayes,L2}}=\mathbb E[s\mid\boldsymbol n]}
$$

가 된다. 이것은 **posterior mean**이다.

| 추정법 | 최소화하거나 최대화하는 기준 |
| --- | --- |
| MLE | Likelihood 최대 |
| MAP | Posterior 최대 |
| Posterior mean | Posterior expected squared error 최소 |
| Posterior median | Posterior expected absolute error 최소 |

Posterior가 비대칭이면 MAP와 mean이 달라질 수 있다. 그러므로 'Bayesian decoder'가 곧 MAP만을 뜻하지는 않는다.

---

## 6. Fisher information: 어느 정도로 정밀하게 추정할 수 있나? (3.3)

### 6.1 Decoder를 설계하는 것과 한계를 구하는 것은 다른 문제

앞에서는 decoding 방법을 만들었다. 이제 **어떤 decoder를 쓰더라도 neural response의 불확실성 때문에 남는 추정 오차의 하한**을 생각해 보자.

자극 $s$에 대한 Fisher information은

$$
\boxed{
I_F(s)=
\mathbb E_{\boldsymbol r\mid s}
\left[
\left(
\frac{\partial}{\partial s}
\log p(\boldsymbol r\mid s)
\right)^2
\right]
}
$$

로 정의한다. 괄호 안의 미분을 **score function**이라 한다.

Likelihood가 $s$에 민감하게 변할수록 서로 가까운 두 자극을 잘 구분할 수 있다. Fisher information은 이 **국소적 구분 가능성**을 정량화한다.

### 6.2 Poisson population의 Fisher information 직접 유도

4절의 독립 Poisson log-likelihood를 다시 쓰자.

$$
\ell(s)=\sum_a
[n_a\log f_a(s)-Tf_a(s)]+\mathrm{const}.
$$

미분하면

$$
\begin{aligned}
\ell'(s)
&=\sum_a
\left[n_a\frac{f_a'(s)}{f_a(s)}-Tf_a'(s)\right]\\
&=\sum_a
\big(n_a-Tf_a(s)\big)\frac{f_a'(s)}{f_a(s)}.
\end{aligned}
$$

Poisson distribution의 평균과 분산은 모두 $Tf_a(s)$이므로

$$
\mathbb E[n_a-Tf_a(s)\mid s]=0,
\qquad
\operatorname{Var}(n_a\mid s)=Tf_a(s).
$$

서로 다른 뉴런의 count가 조건부 독립이라는 가정 아래 교차항의 기댓값이 0이 되어

$$
\begin{aligned}
I_F(s)
&=\mathbb E[(\ell'(s))^2\mid s]\\
&=\sum_a Tf_a(s)
\left[\frac{f_a'(s)}{f_a(s)}\right]^2\\
&=\boxed{
T\sum_{a=1}^{M}\frac{[f_a'(s)]^2}{f_a(s)}
}.
\end{aligned}
\tag{3.44}
$$

**해석:** 각 뉴런의 정보 기여는 **tuning-curve 기울기의 제곱**에 비례하고 그 시점의 **평균 발화율**에 반비례한다. 이 결과는 $f_a(s)>0$이고 Poisson 독립 가정이 적용되는 지점에서 해석한다.

### 6.3 가장 많이 발화하는 지점이 가장 많은 정보를 주는 것은 아니다

Gaussian tuning curve

$$
f(s)=f_{\max}\exp[-(s-s_0)^2/(2\sigma^2)]
$$

를 생각하자. 최고 발화율은 $s=s_0$에서 나타나지만

$$
f'(s_0)=0
\quad\Longrightarrow\quad
\boxed{I_F(s_0)=0}.
$$

이상해 보이지만 **자극을 아주 조금 바꿔도 rate가 일차적으로 변하지 않으므로 국소적 구분이 어렵다**는 의미다.

<svg viewBox="0 0 680 235" style="max-width:100%;height:auto;" role="img" aria-label="Gaussian tuning curve: 중앙에서는 firing rate가 최대이지만 기울기가 0이라 Fisher information이 0인 예시">
  <rect x="1" y="1" width="678" height="232" rx="12" fill="none" stroke="currentColor" stroke-opacity=".18"/>
  <path d="M50 190H633 M50 35V190" stroke="currentColor" stroke-opacity=".35" fill="none" stroke-width="1.5"/>
  <path d="M55 190 C130 190 187 158 238 93 S321 37 340 35 S446 158 505 177 S576 190 625 190" stroke="#0d9488" stroke-width="3" fill="none"/>
  <path d="M55 190 C131 177 178 74 236 81 S314 188 340 190 S422 84 444 81 S552 178 625 190" stroke="#8162d6" stroke-width="3" fill="none"/>
  <circle cx="340" cy="35" r="5" fill="#0d9488"/>
  <circle cx="340" cy="190" r="5" fill="#8162d6"/>
  <path d="M340 30V198" stroke="currentColor" stroke-opacity=".3" stroke-dasharray="5 4"/>
  <text x="340" y="217" font-size="13" text-anchor="middle" fill="currentColor">s₀ — preferred stimulus</text>
  <text x="55" y="25" font-size="13" fill="currentColor">Relative response</text>
  <path d="M445 30h24" stroke="#0d9488" stroke-width="3"/>
  <text x="475" y="34" font-size="12" fill="currentColor">Firing rate</text>
  <path d="M445 49h24" stroke="#8162d6" stroke-width="3"/>
  <text x="475" y="53" font-size="12" fill="currentColor">Fisher information</text>
</svg>

*위 SVG는 Gaussian tuning과 Fisher information의 **정성적인 모양을 그린 개념도**이며 원문의 측정값을 복제한 그림이 아니다.*

### 6.4 Cramér–Rao bound

적절한 regularity condition을 만족하는 **unbiased estimator**라면

$$
\boxed{
\operatorname{Var}(\hat s\mid s)\ge\frac1{I_F(s)}
}
\tag{3.40}
$$

이다. Fisher information이 클수록 가능한 추정 분산의 이론적 하한이 낮아진다.

Estimator에 bias $b(s)=\mathbb E[\hat s\mid s]-s$가 있다면 일반화된 bound는

$$
\operatorname{Var}(\hat s\mid s)\ge
\frac{[1+b'(s)]^2}{I_F(s)}
$$

의 형태다. **모든 biased decoder의 MSE가 무조건 $1/I_F$보다 크다는 뜻은 아니다.**

### 6.5 Tuning 폭과 stimulus 차원

균일하고 조밀한 Gaussian tuning-curve population 등 특정 모델에서는 tuning 폭 $\sigma$에 대한 Fisher information이 대략

$$
I_F\propto \sigma^{D-2}
$$

로 스케일한다. $D$는 stimulus 공간의 차원이다.

| Stimulus 차원 | 폭 $\sigma$를 줄였을 때 |
| --- | --- |
| $D=1$ | 정보가 증가 |
| $D=2$ | 폭에 대한 의존성이 거의 사라짐 |
| $D>2$ | 정보가 감소 |

이것은 개별 뉴런의 높은 기울기와 충분히 많은 뉴런이 활성화되는 **population coverage** 사이의 절충을 보여 준다. 모든 신경회로에 보편적인 정리는 아니다.

---

## 7. Spike-train decoding: 시간에 따라 변하는 자극을 복원하기 (3.4)

### 7.1 Spike count만으로는 시간 구조를 복원하기 어렵다

위의 population decoding은 주로 정적 자극 $s$를 추정했다. 하지만 시각적 운동 속도 같은 자극은 계속 변한다.

$$
s(t).
$$

전체 spike 수 $N$만 사용하면 언제 반응이 일어났는지 정보를 잃는다. 따라서 Chapter 1의

$$
\rho(t)=\sum_i\delta(t-t_i)
$$

를 사용해 각 spike 발생 시각에 decoding kernel을 적용한다.

### 7.2 Reconstruction kernel $K$

평균이 0인 stimulus를 복원할 때, 다음과 같은 **선형 decoder**를 생각한다.

$$
\boxed{
\hat s(t-\tau_0)
=\int_{-\infty}^{\infty}
K(\tau)[\rho(t-\tau)-\bar r]\,d\tau
}
\tag{3.51}
$$

- $K(\tau)$: spike train을 stimulus로 변환하는 decoding filter
- $\bar r$: 평균 firing rate
- $\tau_0$: **decoding delay**. 지금까지의 spike로 시각 $t-\tau_0$의 자극을 복원한다.

Spike train을 대입하면 각 spike 위치에 kernel을 한 번씩 더하는 계산으로 볼 수 있다. 평균 firing-rate 보정항도 함께 적용된다.

### 7.3 Optimal decoder도 least squares로 구한다

Chapter 2에서는 입력 stimulus로 **rate**를 예측하는 linear filter를 찾았다. 이번에는 입력 spike train으로 **stimulus**를 복원한다.

$$
E[K]=\left\langle
\left[s(t-\tau_0)-\hat s(t-\tau_0)\right]^2
\right\rangle_t.
$$

필터 $K$를 조금 변경하는 변분 계산을 수행하면 다음의 **Wiener–Hopf equation**을 얻는다.

$$
\boxed{
\int_{-\infty}^{\infty}
Q_{\rho\rho}(\tau-\tau')K(\tau')\,d\tau'
=Q_{rs}(\tau-\tau_0)
}
\tag{3.53}
$$

왼쪽의 $Q_{\rho\rho}$는 **중심화된 spike train의 autocorrelation**, 오른쪽의 $Q_{rs}$는 rate–stimulus cross-correlation이다.

이는 Chapter 2의 $Q_{ss}*D=Q_{rs}$와 구조적으로 같다. 다만 **입력과 출력을 뒤바꾸었다**는 점이 중요하다.

### 7.4 Spike train의 시간 상관이 없다고 가정하면

특별한 경우에

$$
Q_{\rho\rho}(\tau)=\bar r\,\delta(\tau)
$$

라면 Wiener–Hopf equation은 간단해지고

$$
\boxed{
K(\tau)
=\frac{Q_{rs}(\tau-\tau_0)}{\bar r}
=C(\tau_0-\tau)
}
\tag{3.57}
$$

가 된다. $C$는 Chapter 1의 spike-triggered average다.

따라서 이 단순화된 모델에서는 **spike 한 번마다 그 주변의 평균 stimulus 패턴을 더하는 방식**으로 복원할 수 있다. 일반적인 spike train에는 autocorrelation이 있어서 이보다 복잡한 보정이 필요하다.

### 7.5 Fourier domain에서 Wiener–Hopf 풀기

Convolution을 Fourier transform하면 곱셈으로 바뀐다. 원문의 transform 부호 convention을 따르면

$$
\boxed{
\widetilde K(\omega)
=
\frac{
\widetilde Q_{rs}(\omega)e^{i\omega\tau_0}
}{
\widetilde Q_{\rho\rho}(\omega)
}
}
\tag{3.59}
$$

가 된다. 분모는 spike train의 autocorrelation을 보정한다. 실제로는 분모가 작아지는 주파수에서 계산이 불안정할 수 있으므로 regularization 등을 고려할 수 있다.

**주의:** 위 식은 **인과성 제약이 없는 최적 선형 해**다. 정말 시각 $t$ 이전의 spike만 사용하려면 $K(\tau)=0$ for $\tau<0$인 **causal filter**를 구해야 하며, 단순히 acausal 해를 잘라내는 것이 항상 엄밀한 최적해는 아니다.

### 7.6 왜 decoding delay가 필요한가?

Spike는 원인 자극보다 늦게 발생한다. 따라서 **시각 $t$까지의 spike만 사용해서 바로 그 시각 $t$의 변화하는 자극을 복원**하려 하면 충분한 증거가 아직 도착하지 않았을 수 있다.

그래서 과거의 자극 $s(t-\tau_0)$를 복원한다. 이때

$$
\boxed{
\text{복원 정확도}
\quad\longleftrightarrow\quad
\text{복원 지연}
}
$$

의 trade-off가 생긴다. Real-time BCI와 neural decoding에서 매우 중요한 실용적 고려사항이다.

---

## 8. 핵심 공식 한눈에 보기

| 주제 | 핵심 관계 | 기억할 해석 |
| --- | --- | --- |
| Bayesian decoding | $p(s\mid\boldsymbol r)\propto p(\boldsymbol r\mid s)p(s)$ | Likelihood와 prior를 함께 고려 |
| Discriminability | $d'=(\mu_+-\mu_-)/\sigma_r$ | 평균 차이 / noise |
| ROC / 2AFC | $\mathrm{AUC}=P(r_+>r_-)$ | 독립 연속 반응에서의 비교 성공률 |
| Population vector | $\boldsymbol v=\sum_a w_ar_a\boldsymbol c_a$ | 뉴런들의 방향별 가중 투표 |
| Poisson ML | $\hat s=\arg\max_sP(\boldsymbol n\mid s)$ | 관측한 count가 가장 그럴듯한 자극 |
| MAP | $\hat s=\arg\max_sP(\boldsymbol n\mid s)p(s)$ | Prior까지 반영한 최대점 |
| Bayes squared error | $\hat s=\mathbb E[s\mid\boldsymbol n]$ | Posterior mean |
| Poisson Fisher | $I_F=T\sum_a f_a'^2/f_a$ | Tuning curve의 **기울기**가 중요 |
| Cramér–Rao | $\operatorname{Var}(\hat s)\ge 1/I_F$ | Unbiased 추정의 분산 하한 |
| Spike-train decoder | $\hat s=K*(\rho-\bar r)$ | Spike 시각을 써서 시간 신호 복원 |
| Fourier decoder | $\widetilde K=\widetilde Q_{rs}e^{i\omega\tau_0}/\widetilde Q_{\rho\rho}$ | Spike autocorrelation 보정 |

---

## 9. Chapter 3 복습 질문 — 누르면 해설이 펼쳐짐

<details markdown="1">
<summary><strong>Q1. Encoding likelihood를 알고 있다면 posterior를 바로 알 수 있을까?</strong></summary>

일반적으로 **아니다.** Bayes' theorem

$$
p(s\mid\boldsymbol r)
=\frac{p(\boldsymbol r\mid s)p(s)}{p(\boldsymbol r)}
$$

에서 **stimulus prior** $p(s)$도 필요하다. Likelihood는 자극을 조건으로 한 response의 분포이고 posterior는 response를 조건으로 한 자극의 분포다.

</details>

<details markdown="1">
<summary><strong>Q2. 두 반응 분포의 평균 차이가 같을 때 분산만 커지면 어떤 일이 일어날까?</strong></summary>

$$
d'=\frac{\mu_+-\mu_-}{\sigma_r}
$$

이므로 $\sigma_r$가 커지면 $d'$가 감소한다. 반응 분포가 더 많이 겹쳐 ROC AUC도 0.5 쪽으로 가까워진다. **Noise 크기**를 제외한 평균 차이만으로 판별력을 판단하면 안 된다.

</details>

<details markdown="1">
<summary><strong>Q3. MAP와 posterior mean은 항상 같은가?</strong></summary>

아니다. MAP는 posterior가 가장 높은 **최빈값**이고, posterior mean은 posterior expected squared error를 최소화한다. 대칭 Gaussian posterior에서는 일치하지만 비대칭 또는 다봉형 posterior에서는 달라질 수 있다.

</details>

<details markdown="1">
<summary><strong>Q4. Gaussian tuning curve의 정점에서 Fisher information이 0인 이유는?</strong></summary>

정점에서 $f'(s)=0$이므로 작은 자극 변화가 firing rate에 일차 변화를 거의 주지 않는다. 독립 Poisson 모델에서는

$$
I_F(s)=T\frac{[f'(s)]^2}{f(s)}
$$

이므로 $f(s)>0$인 정점에서 $I_F=0$이다. **발화율이 가장 큰 곳이 언제나 가장 informative한 곳은 아니다.**

</details>

<details markdown="1">
<summary><strong>Q5. Chapter 2와 Chapter 3의 Wiener–Hopf equation은 무엇이 다른가?</strong></summary>

두 문제 모두 **최소제곱오차를 최소화하는 선형 필터**를 구한다.

- **Chapter 2:** Stimulus $s$를 입력으로 firing rate $r$를 예측한다.
- **Chapter 3:** Spike train $\rho$를 입력으로 stimulus $s$를 복원한다.

따라서 입력 신호의 autocorrelation이 Chapter 2에서는 $Q_{ss}$, Chapter 3에서는 $Q_{\rho\rho}$가 된다.

</details>

<details markdown="1">
<summary><strong>Q6. Spike-train decoding에서 $\tau_0$가 필요한 이유는?</strong></summary>

뉴런의 spike는 자극보다 지연되어 발생한다. $\tau_0>0$로 두면 현재까지의 spike 정보를 이용해 **조금 과거의 자극**을 재구성한다. 큰 delay는 더 많은 반응 정보를 사용할 여지를 주지만 복원 결과를 늦게 얻는다는 단점이 있다.

</details>

<details markdown="1">
<summary><strong>Q7. Poisson population의 Fisher information을 계산할 때 '독립' 가정이 중요한 이유는?</strong></summary>

Score $\ell'(s)$는 뉴런별 항의 합이다. 뉴런들이 조건부 독립이면 서로 다른 뉴런의 score 항에 대한 공분산이 0이 되므로 Fisher information이 각 뉴런 기여도의 합

$$
I_F(s)=T\sum_a\frac{[f_a'(s)]^2}{f_a(s)}
$$

으로 단순화된다. Correlated population에서는 공분산 구조를 고려해야 한다.

</details>

---

## 10. Chapter 1–3의 연결과 다음 장

**Chapter 1 — Spike statistics**

$$
\rho(t)\longrightarrow \hat r(t),\;\mathrm{STA},\;\text{Poisson statistics}
$$

**Chapter 2 — Neural encoding**

$$
s(t)\longrightarrow r(t)\longrightarrow \rho(t)
$$

**Chapter 3 — Neural decoding**

$$
\boldsymbol r,\rho(t)\longrightarrow \hat s,\hat s(t)
$$

이제 Chapter 4의 **Information Theory**에서는 특정 decoder의 정확도만 묻는 대신, neural response가 stimulus에 대해 **평균적으로 얼마나 많은 정보를 담는가**를 탐구한다.

BCI 관점에서는 특히 Chapter 3의 **Poisson likelihood, population decoding, Fisher information, causal spike-train reconstruction**을 따로 구현해 보면 도움이 된다.

---

## 참고 자료

- Peter Dayan and L. F. Abbott, *Theoretical Neuroscience: Computational and Mathematical Modeling of Neural Systems*, Chapter 3, **Neural Decoding**, pp. 87–122.
- [Chapter 3 원문 PDF (University of Edinburgh)](https://homepages.inf.ed.ac.uk/pseries/BA/book/decode.pdf)
- [Theoretical Neuroscience — 저자 공식 도서 페이지](https://www.gatsby.ucl.ac.uk/~dayan/book/)
- [Chapter 1 학습 노트]({{ '/blog/2026/dayan-abbott-chapter-1/' | relative_url }})
- [Chapter 2 학습 노트]({{ '/blog/2026/dayan-abbott-chapter-2/' | relative_url }})
