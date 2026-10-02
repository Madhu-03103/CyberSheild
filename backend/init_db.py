"""Initialize database with sample data"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from datetime import datetime, timedelta
import random
from app.database import SessionLocal, init_db
from app.models.user import User, UserRole
from app.models.threat import ThreatEvent, URLScan, EmailScan, EventSource, Severity, ThreatType
from app.models.incident import Incident, IncidentStatus, IncidentSeverity
from app.models.indicator import Indicator, IndicatorType, Watchlist


def create_sample_users(db):
    """Create sample users"""
    users = [
        User(
            email="admin@cybershield.ai",
            username="admin",
            password_hash="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lFkJJZHlqLsq",  # password
            role=UserRole.ADMIN
        ),
        User(
            email="analyst@cybershield.ai",
            username="analyst",
            password_hash="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lFkJJZHlqLsq",
            role=UserRole.ANALYST
        )
    ]
    
    for user in users:
        existing = db.query(User).filter(User.email == user.email).first()
        if not existing:
            db.add(user)
    
    db.commit()
    print("✓ Created sample users (password: 'password')")


def create_sample_threats(db):
    """Create sample threat events"""
    threat_types = [ThreatType.PHISHING, ThreatType.MALWARE, ThreatType.SUSPICIOUS, ThreatType.SPAM, ThreatType.SAFE]
    severities = [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW]
    sources = [EventSource.URL_SCANNER, EventSource.EMAIL_INSPECTOR, EventSource.ML_ENGINE, EventSource.WATCHLIST]
    
    # Create events for the last 7 days
    for i in range(100):
        days_ago = random.randint(0, 7)
        hours_ago = random.randint(0, 23)
        timestamp = datetime.utcnow() - timedelta(days=days_ago, hours=hours_ago)
        
        threat_type = random.choice(threat_types)
        severity = Severity.CRITICAL if threat_type == ThreatType.PHISHING else random.choice(severities)
        
        event = ThreatEvent(
            event_id=f"EVT-{timestamp.strftime('%Y%m%d%H%M%S')}-{random.randint(10000, 99999)}",
            source=random.choice(sources),
            event_type="DETECTION",
            timestamp=timestamp,
            severity=severity,
            threat_type=threat_type,
            entity=f"suspicious-domain-{i}.example.com" if random.random() > 0.5 else f"user{i}@example.com",
            risk_score=random.randint(30, 99) if threat_type != ThreatType.SAFE else random.randint(0, 30),
            confidence=random.uniform(0.75, 0.99),
            status="ACTIVE" if threat_type != ThreatType.SAFE else "RESOLVED"
        )
        db.add(event)
    
    db.commit()
    print("✓ Created 100 sample threat events")


def create_sample_url_scans(db):
    """Create sample URL scans"""
    domains = [
        "paypal-secure-login.xyz",
        "amazon-verify-account.info",
        "microsoft-update.ru",
        "google-drive-share.tk",
        "facebook-security-check.ml",
        "legitimate-website.com",
        "trusted-domain.org",
        "safe-site.net"
    ]
    
    for i in range(50):
        domain = random.choice(domains)
        is_safe = domain in domains[-3:]
        
        scan = URLScan(
            scan_id=f"URL-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{random.randint(10000, 99999)}",
            url=f"https://{domain}/path/{random.randint(1000, 9999)}",
            prediction=ThreatType.SAFE if is_safe else random.choice([ThreatType.PHISHING, ThreatType.SUSPICIOUS]),
            risk_score=random.randint(10, 40) if is_safe else random.randint(60, 99),
            confidence=random.uniform(0.80, 0.98),
            timestamp=datetime.utcnow() - timedelta(hours=random.randint(0, 72))
        )
        db.add(scan)
    
    db.commit()
    print("✓ Created 50 sample URL scans")


def create_sample_email_scans(db):
    """Create sample email scans"""
    subjects = [
        "URGENT: Verify your account immediately",
        "Your package is waiting for delivery",
        "Security alert: Unusual activity detected",
        "Invoice #12345 - Payment Required",
        "Team meeting notes from yesterday",
        "Monthly report is ready for review"
    ]
    
    for i in range(50):
        subject = random.choice(subjects)
        is_safe = "meeting" in subject.lower() or "report" in subject.lower()
        
        scan = EmailScan(
            scan_id=f"EMAIL-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{random.randint(10000, 99999)}",
            sender=f"sender{i}@example.com",
            recipient="recipient@organization.gov",
            subject=subject,
            prediction=ThreatType.SAFE if is_safe else random.choice([ThreatType.PHISHING, ThreatType.SPAM]),
            risk_score=random.randint(10, 40) if is_safe else random.randint(60, 99),
            confidence=random.uniform(0.78, 0.97),
            timestamp=datetime.utcnow() - timedelta(hours=random.randint(0, 72))
        )
        db.add(scan)
    
    db.commit()
    print("✓ Created 50 sample email scans")


def create_sample_incidents(db):
    """Create sample incidents"""
    titles = [
        "Phishing Campaign Targeting Department Employees",
        "Suspicious Login Attempts from Foreign IP",
        "Malware Detected in Email Attachment",
        "Data Exfiltration Attempt Blocked",
        "Ransomware Indicators Found"
    ]
    
    statuses = [IncidentStatus.NEW, IncidentStatus.TRIAGED, IncidentStatus.INVESTIGATING, IncidentStatus.RESOLVED]
    severities = [IncidentSeverity.CRITICAL, IncidentSeverity.HIGH, IncidentSeverity.MEDIUM, IncidentSeverity.LOW]
    
    for i in range(20):
        status = random.choice(statuses)
        incident = Incident(
            incident_id=f"INC-{datetime.utcnow().strftime('%Y')}-{1000 + i}",
            title=random.choice(titles),
            description=f"Automated detection of suspicious activity. Investigation required.",
            status=status,
            severity=random.choice(severities),
            assigned_analyst=None if status == IncidentStatus.NEW else 2,  # analyst user id
            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
            updated_at=datetime.utcnow() - timedelta(hours=random.randint(0, 24))
        )
        db.add(incident)
    
    db.commit()
    print("✓ Created 20 sample incidents")


def create_sample_indicators(db):
    """Create sample indicators"""
    ioc_types = [IndicatorType.IP, IndicatorType.DOMAIN, IndicatorType.URL, IndicatorType.EMAIL, IndicatorType.HASH]
    
    samples = {
        IndicatorType.IP: ["192.168.1.1", "10.0.0.1", "172.16.0.1"],
        IndicatorType.DOMAIN: ["malicious-site.com", "phishing-domain.xyz", "c2-server.ru"],
        IndicatorType.URL: ["http://evil.com/payload", "https://phish.net/login"],
        IndicatorType.EMAIL: ["attacker@evil.com", "phisher@scam.net"],
        IndicatorType.HASH: ["d41d8cd98f00b204e9800998ecf8427e", "098f6bcd4621d373cade4e832627b4f6"]
    }
    
    for ioc_type in ioc_types:
        for value in samples[ioc_type]:
            indicator = Indicator(
                indicator=value,
                indicator_type=ioc_type,
                threat_category=random.choice(["PHISHING", "MALWARE", "SUSPICIOUS"]),
                risk_score=random.uniform(60, 99),
                confidence=random.uniform(0.70, 0.99),
                first_seen=datetime.utcnow() - timedelta(days=random.randint(1, 90)),
                last_seen=datetime.utcnow() - timedelta(hours=random.randint(0, 24)),
                source="threat_feed"
            )
            db.add(indicator)
    
    db.commit()
    print("✓ Created sample indicators")


def create_sample_watchlist(db):
    """Create sample watchlist entries"""
    items = [
        ("critical-infrastructure.gov", IndicatorType.DOMAIN),
        ("192.0.2.1", IndicatorType.IP),
        ("executive@organization.gov", IndicatorType.EMAIL),
    ]
    
    for value, ioc_type in items:
        entry = Watchlist(
            indicator=value,
            indicator_type=ioc_type,
            notes="High-value target monitoring",
            added_by=1,  # admin user id
            created_at=datetime.utcnow() - timedelta(days=random.randint(1, 30))
        )
        db.add(entry)
    
    db.commit()
    print("✓ Created sample watchlist entries")


def main():
    """Initialize database with sample data"""
    print("\n🚀 Initializing CyberShield AI Database...\n")
    
    # Initialize database schema
    init_db()
    print("✓ Database schema created\n")
    
    # Create session
    db = SessionLocal()
    
    try:
        # Create sample data
        create_sample_users(db)
        create_sample_threats(db)
        create_sample_url_scans(db)
        create_sample_email_scans(db)
        create_sample_incidents(db)
        create_sample_indicators(db)
        create_sample_watchlist(db)
        
        print("\n✅ Database initialization complete!")
        print("\n📊 Summary:")
        print(f"   • Users: {db.query(User).count()}")
        print(f"   • Threat Events: {db.query(ThreatEvent).count()}")
        print(f"   • URL Scans: {db.query(URLScan).count()}")
        print(f"   • Email Scans: {db.query(EmailScan).count()}")
        print(f"   • Incidents: {db.query(Incident).count()}")
        print(f"   • Indicators: {db.query(Indicator).count()}")
        print(f"   • Watchlist: {db.query(Watchlist).count()}")
        
        print("\n👤 Login Credentials:")
        print("   Email: admin@cybershield.ai")
        print("   Password: password")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
