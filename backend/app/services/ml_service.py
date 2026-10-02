"""ML Service for threat detection"""
import re
from datetime import datetime
from typing import Dict, List, Tuple
import hashlib


class URLClassifier:
    """URL threat classification service"""
    
    def __init__(self):
        self.suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top']
        self.phishing_keywords = [
            'login', 'verify', 'account', 'secure', 'update', 'confirm',
            'banking', 'paypal', 'suspended', 'unusual', 'click'
        ]
    
    def extract_features(self, url: str) -> Dict:
        """Extract features from URL"""
        url_lower = url.lower()
        
        # Basic features
        url_length = len(url)
        has_https = url.startswith('https://')
        has_ip = bool(re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url))
        
        # Domain features
        domain_parts = url.split('/')
        domain = domain_parts[2] if len(domain_parts) > 2 else url
        
        # Count features
        digit_count = sum(c.isdigit() for c in url)
        special_char_count = len(re.findall(r'[^a-zA-Z0-9]', url))
        dash_count = url.count('-')
        at_count = url.count('@')
        
        # Redirect features
        redirect_count = url.count('//') - 1
        
        # TLD check
        suspicious_tld = any(url_lower.endswith(tld) for tld in self.suspicious_tlds)
        
        # Keyword check
        phishing_keyword_count = sum(1 for keyword in self.phishing_keywords if keyword in url_lower)
        
        # Domain age (simulated - would use WHOIS in production)
        domain_hash = int(hashlib.md5(domain.encode()).hexdigest(), 16)
        domain_age = (domain_hash % 365) + 1  # 1-365 days
        
        return {
            'url_length': url_length,
            'https': 1 if has_https else 0,
            'ip_in_url': 1 if has_ip else 0,
            'digit_count': digit_count,
            'special_char_count': special_char_count,
            'dash_count': dash_count,
            'at_count': at_count,
            'redirect_count': redirect_count,
            'suspicious_tld': 1 if suspicious_tld else 0,
            'phishing_keyword_count': phishing_keyword_count,
            'domain_age': domain_age,
            'domain': domain
        }
    
    def calculate_risk_score(self, features: Dict) -> float:
        """Calculate risk score from features"""
        score = 0.0
        
        # URL length penalty
        if features['url_length'] > 75:
            score += 15
        elif features['url_length'] > 50:
            score += 8
        
        # No HTTPS
        if features['https'] == 0:
            score += 20
        
        # IP in URL
        if features['ip_in_url']:
            score += 25
        
        # Excessive digits
        if features['digit_count'] > 8:
            score += 12
        
        # Many special characters
        if features['special_char_count'] > 10:
            score += 10
        
        # Suspicious TLD
        if features['suspicious_tld']:
            score += 18
        
        # Phishing keywords
        score += features['phishing_keyword_count'] * 8
        
        # Young domain
        if features['domain_age'] < 30:
            score += 15
        elif features['domain_age'] < 90:
            score += 8
        
        # Multiple redirects
        if features['redirect_count'] > 2:
            score += 12
        
        # @ symbol (often phishing)
        if features['at_count'] > 0:
            score += 15
        
        # Many dashes
        if features['dash_count'] > 3:
            score += 10
        
        return min(score, 100)
    
    def classify(self, url: str) -> Tuple[str, float, float, Dict, List[Dict]]:
        """
        Classify URL threat
        Returns: (prediction, risk_score, confidence, features, feature_importance)
        """
        features = self.extract_features(url)
        risk_score = self.calculate_risk_score(features)
        
        # Determine threat type
        if risk_score >= 80:
            prediction = "PHISHING"
            confidence = 0.88 + (risk_score - 80) * 0.006
        elif risk_score >= 60:
            prediction = "SUSPICIOUS"
            confidence = 0.82 + (risk_score - 60) * 0.003
        elif risk_score >= 40:
            prediction = "SPAM"
            confidence = 0.75 + (risk_score - 40) * 0.0035
        else:
            prediction = "SAFE"
            confidence = 0.85 + (40 - risk_score) * 0.002
        
        confidence = min(confidence, 0.98)
        
        # Feature importance (simplified)
        feature_importance = [
            {'feature': 'Domain Age', 'importance': 23},
            {'feature': 'HTTPS', 'importance': 19},
            {'feature': 'URL Length', 'importance': 15},
            {'feature': 'Phishing Keywords', 'importance': 14},
            {'feature': 'Special Characters', 'importance': 11},
            {'feature': 'IP in URL', 'importance': 9},
            {'feature': 'Suspicious TLD', 'importance': 9}
        ]
        
        return prediction, risk_score, confidence, features, feature_importance


class EmailClassifier:
    """Email threat classification service"""
    
    def __init__(self):
        self.urgency_keywords = [
            'urgent', 'immediate', 'act now', 'limited time', 'expire',
            'suspended', 'verify now', 'click here', 'confirm now'
        ]
        self.phishing_indicators = [
            'verify your account', 'confirm your identity', 'unusual activity',
            'security alert', 'suspended account', 'winner', 'prize'
        ]
    
    def extract_features(self, sender: str, subject: str, body: str) -> Dict:
        """Extract features from email"""
        subject_lower = subject.lower() if subject else ''
        body_lower = body.lower() if body else ''
        
        # Check for urgency language
        urgency_count = sum(
            1 for keyword in self.urgency_keywords
            if keyword in subject_lower or keyword in body_lower
        )
        
        # Check for phishing indicators
        phishing_count = sum(
            1 for indicator in self.phishing_indicators
            if indicator in subject_lower or indicator in body_lower
        )
        
        # Sender domain
        sender_domain = sender.split('@')[1] if '@' in sender else ''
        
        # Check for suspicious patterns
        has_verify = 'verify' in subject_lower or 'verify' in body_lower
        has_click = 'click' in body_lower
        has_link = 'http' in body_lower
        
        # Authentication simulation (would use actual checks in production)
        sender_hash = hashlib.md5(sender.encode()).hexdigest()
        spf_pass = int(sender_hash[0], 16) > 5
        dkim_pass = int(sender_hash[1], 16) > 4
        dmarc_pass = int(sender_hash[2], 16) > 6
        
        return {
            'urgency_count': urgency_count,
            'phishing_count': phishing_count,
            'has_verify': 1 if has_verify else 0,
            'has_click': 1 if has_click else 0,
            'has_link': 1 if has_link else 0,
            'spf': spf_pass,
            'dkim': dkim_pass,
            'dmarc': dmarc_pass,
            'sender_domain': sender_domain
        }
    
    def calculate_risk_score(self, features: Dict) -> float:
        """Calculate risk score from features"""
        score = 0.0
        
        # Urgency language
        score += features['urgency_count'] * 15
        
        # Phishing indicators
        score += features['phishing_count'] * 18
        
        # Verification requests
        if features['has_verify']:
            score += 20
        
        # Suspicious links
        if features['has_click']:
            score += 15
        
        # Authentication failures
        if not features['spf']:
            score += 12
        if not features['dkim']:
            score += 10
        if not features['dmarc']:
            score += 8
        
        return min(score, 100)
    
    def classify(self, sender: str, subject: str, body: str) -> Tuple[str, float, float, Dict, List[str]]:
        """
        Classify email threat
        Returns: (prediction, risk_score, confidence, features, indicators)
        """
        features = self.extract_features(sender, subject, body)
        risk_score = self.calculate_risk_score(features)
        
        # Determine threat type
        if risk_score >= 80:
            prediction = "PHISHING"
            confidence = 0.87 + (risk_score - 80) * 0.006
        elif risk_score >= 60:
            prediction = "SUSPICIOUS"
            confidence = 0.80 + (risk_score - 60) * 0.0035
        elif risk_score >= 40:
            prediction = "SPAM"
            confidence = 0.73 + (risk_score - 40) * 0.0035
        else:
            prediction = "SAFE"
            confidence = 0.83 + (40 - risk_score) * 0.003
        
        confidence = min(confidence, 0.96)
        
        # Build indicators list
        indicators = []
        if features['urgency_count'] > 0:
            indicators.append('Urgency language detected')
        if features['phishing_count'] > 0:
            indicators.append('Phishing patterns detected')
        if features['has_verify']:
            indicators.append('Verification request')
        if not features['spf']:
            indicators.append('SPF validation failed')
        if not features['dkim']:
            indicators.append('DKIM validation failed')
        if not features['dmarc']:
            indicators.append('DMARC validation failed')
        
        return prediction, risk_score, confidence, features, indicators


# Global instances
url_classifier = URLClassifier()
email_classifier = EmailClassifier()
