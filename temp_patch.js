async function checkWalletStatus() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/${currentUser.email}`);
        const user = await res.json();
        
        // Hide all states first
        document.getElementById('walletDisconnected').style.display = 'none';
        document.getElementById('walletPending').style.display = 'none';
        document.getElementById('walletApproved').style.display = 'none';
        
        // Update Badge
        const badge = document.getElementById('walletStatusBadge');
        
        if (user.walletStatus === 'approved') {
            document.getElementById('walletApproved').style.display = 'block';
            document.getElementById('displayWalletAddress').textContent = user.walletAddress;
            badge.textContent = 'Connected';
            badge.className = 'status-badge approved';
        } else if (user.walletStatus === 'pending') {
            document.getElementById('walletPending').style.display = 'block';
            badge.textContent = 'Verifying';
            badge.className = 'status-badge pending';
        } else {
            document.getElementById('walletDisconnected').style.display = 'block';
            badge.textContent = 'Not Connected';
            badge.className = 'status-badge disconnected';
        }
    } catch (error) { console.log(error); }
}
